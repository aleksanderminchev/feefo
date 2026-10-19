package com.feefo.jobtitles;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NormaliserTest {

    private final Normaliser normaliser = new Normaliser();

    @Nested
    class Normalise {

        @ParameterizedTest(name = "\"{0}\" -> \"{1}\"")
        @CsvSource(delimiter = '|', value = {
                // Examples from the brief
                "Java engineer      | Software engineer",
                "C# engineer        | Software engineer",
                "Accountant         | Accountant",
                "Chief Accountant   | Accountant",
                // Every normalised title maps to itself
                "Architect          | Architect",
                "Software engineer  | Software engineer",
                "Quantity surveyor  | Quantity surveyor",
        })
        void mapsBriefExamples(String input, String expected) {
            assertEquals(expected, normaliser.normalise(input));
        }

        @ParameterizedTest(name = "\"{0}\" -> \"{1}\"")
        @CsvSource(delimiter = '|', value = {
                "ACCOUNTANT                    | Accountant",
                "  software   ENGINEER         | Software engineer",
                "Senior C++ engineer           | Software engineer",
                "Engineer                      | Software engineer",
                "Senior Quantity Surveyor      | Quantity surveyor",
                "Lead architect                | Architect",
                "Acountant                     | Accountant",
                "Software Engineers            | Software engineer",
                "Accountant, chief             | Accountant",
        })
        void toleratesCaseWhitespacePunctuationTyposAndExtraWords(String input, String expected) {
            assertEquals(expected, normaliser.normalise(input));
        }

        @Test
        void returnsTrimmedInputWhenNothingMatches() {
            assertEquals("Dentist", normaliser.normalise("  Dentist "));
        }

        @Test
        void isRepeatableOnTheSameInstance() {
            String first = normaliser.normalise("Java engineer");
            String second = normaliser.normalise("Java engineer");
            assertEquals(first, second);
        }

        @Test
        void rejectsNull() {
            assertThrows(NullPointerException.class, () -> normaliser.normalise(null));
        }

        @ParameterizedTest
        @ValueSource(strings = {"", " ", "\t\n"})
        void rejectsBlank(String blank) {
            assertThrows(IllegalArgumentException.class, () -> normaliser.normalise(blank));
        }
    }

    @Nested
    class MatchResult {

        @Test
        void exactMatchScoresOne() {
            Match match = normaliser.match("Accountant").orElseThrow();
            assertEquals("Accountant", match.title());
            assertEquals(1.0, match.score(), 1e-9);
        }

        @Test
        void partialMatchScoresBetweenZeroAndOne() {
            Match match = normaliser.match("Chief Accountant").orElseThrow();
            assertEquals("Accountant", match.title());
            assertEquals(2.0 / 3.0, match.score(), 1e-9);
        }

        @Test
        void isEmptyWhenNothingMatches() {
            assertEquals(Optional.empty(), normaliser.match("Dentist"));
        }

        @Test
        void isEmptyForInputWithNoWords() {
            assertEquals(Optional.empty(), normaliser.match("!!! ---"));
        }

        @Test
        void isEmptyWhenBestScoreIsBelowMinimum() {
            Normaliser strict = new Normaliser(List.of("Accountant"), (a, b) -> 0.4, 0.5);
            assertEquals(Optional.empty(), strict.match("anything"));
        }

        @Test
        void acceptsScoreEqualToMinimum() {
            Normaliser normaliserAtThreshold = new Normaliser(List.of("Accountant"), (a, b) -> 0.5, 0.5);
            assertEquals(Optional.of(new Match("Accountant", 0.5)), normaliserAtThreshold.match("anything"));
        }

        @Test
        void tieIsWonByTheTitleListedFirst() {
            Normaliser tied = new Normaliser(List.of("First", "Second", "Third"), (a, b) -> 0.7, 0.5);
            assertEquals("First", tied.normalise("anything"));
        }

        @Test
        void highestScoreWinsRegardlessOfOrder() {
            Normaliser normaliserWithStub = new Normaliser(
                    List.of("Low", "High", "Medium"),
                    (input, candidate) -> switch (candidate) {
                        case "High" -> 0.9;
                        case "Medium" -> 0.6;
                        default -> 0.3;
                    },
                    0.1);
            assertEquals(new Match("High", 0.9), normaliserWithStub.match("anything").orElseThrow());
        }

        @ParameterizedTest
        @ValueSource(doubles = {-0.1, 1.1, Double.NaN})
        void rejectsScorerReturningOutOfRangeScore(double badScore) {
            Normaliser broken = new Normaliser(List.of("Accountant"), (a, b) -> badScore, 0.5);
            assertThrows(IllegalStateException.class, () -> broken.match("Accountant"));
        }
    }

    @Nested
    class Construction {

        @Test
        void defaultConstructorUsesTitlesFromTheBrief() {
            assertEquals(
                    List.of("Architect", "Software engineer", "Quantity surveyor", "Accountant"),
                    normaliser.getNormalisedTitles());
        }

        @Test
        void supportsCustomTitles() {
            Normaliser custom = new Normaliser(List.of("Nurse", "Doctor"));
            assertEquals("Nurse", custom.normalise("Senior staff nurse"));
        }

        @Test
        void trimsTitles() {
            Normaliser custom = new Normaliser(List.of("  Nurse  "));
            assertEquals(List.of("Nurse"), custom.getNormalisedTitles());
        }

        @Test
        void copiesTitlesDefensively() {
            List<String> titles = new ArrayList<>(List.of("Nurse"));
            Normaliser custom = new Normaliser(titles);

            titles.add("Doctor");

            assertEquals(List.of("Nurse"), custom.getNormalisedTitles());
        }

        @Test
        void exposedTitlesAreImmutable() {
            assertThrows(UnsupportedOperationException.class,
                    () -> normaliser.getNormalisedTitles().add("Doctor"));
        }

        @Test
        void rejectsNullTitles() {
            assertThrows(NullPointerException.class, () -> new Normaliser(null));
        }

        @Test
        void rejectsEmptyTitles() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(List.of()));
        }

        @Test
        void rejectsNullTitleEntry() {
            List<String> titles = Arrays.asList("Nurse", null);
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(titles));
        }

        @Test
        void rejectsBlankTitleEntry() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(List.of("Nurse", "  ")));
        }

        @Test
        void rejectsCaseInsensitiveDuplicateTitles() {
            assertThrows(IllegalArgumentException.class, () -> new Normaliser(List.of("Nurse", " NURSE")));
        }

        @Test
        void rejectsNullScorer() {
            assertThrows(NullPointerException.class, () -> new Normaliser(List.of("Nurse"), null, 0.5));
        }

        @ParameterizedTest
        @ValueSource(doubles = {0.0, -0.5, 1.01, Double.NaN})
        void rejectsInvalidMinimumScore(double minimumScore) {
            assertThrows(IllegalArgumentException.class,
                    () -> new Normaliser(List.of("Nurse"), (a, b) -> 1.0, minimumScore));
        }

        @Test
        void acceptsMinimumScoreOfOne() {
            Normaliser exactOnly = new Normaliser(List.of("Nurse"), (a, b) -> a.equals(b) ? 1.0 : 0.9, 1.0);
            assertTrue(exactOnly.match("Nurse").isPresent());
            assertTrue(exactOnly.match("Nurses").isEmpty());
        }
    }
}
