package com.feefo.jobtitles.similarity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TokenSimilarityScorerTest {

    private static final double DELTA = 1e-9;

    private final TokenSimilarityScorer scorer = new TokenSimilarityScorer();

    @ParameterizedTest(name = "\"{0}\" vs \"{1}\" = {2}")
    @CsvSource(delimiter = '|', value = {
            "Accountant           | Accountant        | 1.0",
            "accountant           | ACCOUNTANT        | 1.0",
            "Chief Accountant     | Accountant        | 0.6666666667",
            "Java engineer        | Software engineer | 0.5",
            "Java engineer        | Architect         | 0.0",
            "Engineer software    | Software engineer | 1.0",
    })
    void scoresExamples(String first, String second, double expected) {
        assertEquals(expected, scorer.score(first, second), 1e-6);
    }

    @Test
    void closeWordsCountAsPartialMatches() {
        // "acountant" vs "accountant" has character similarity 0.9, above the 0.8 threshold.
        assertEquals(0.9, scorer.score("Acountant", "Accountant"), DELTA);
    }

    @Test
    void wordsBelowThresholdContributeNothing() {
        // "architect" vs "architecture" has character similarity 0.75, below the 0.8 threshold.
        assertEquals(0.0, scorer.score("Architecture", "Architect"), DELTA);
    }

    @Test
    void extraWordsLowerTheScore() {
        assertTrue(scorer.score("Senior Chief Accountant", "Accountant")
                < scorer.score("Chief Accountant", "Accountant"));
    }

    @Test
    void isSymmetric() {
        assertEquals(scorer.score("Java engineer", "Software engineer"),
                scorer.score("Software engineer", "Java engineer"), DELTA);
    }

    @Test
    void inputWithoutWordsScoresZero() {
        assertEquals(0.0, scorer.score("!!!", "Accountant"));
        assertEquals(0.0, scorer.score("", ""));
    }

    @Test
    void usesInjectedTokenScorerAndThreshold() {
        SimilarityScorer alwaysHalf = (a, b) -> 0.5;
        assertEquals(0.5, new TokenSimilarityScorer(new Tokenizer(), alwaysHalf, 0.5).score("a b", "c"), DELTA);
        assertEquals(0.0, new TokenSimilarityScorer(new Tokenizer(), alwaysHalf, 0.6).score("a b", "c"), DELTA);
    }

    @Test
    void clampsMisbehavingTokenScorer() {
        SimilarityScorer tooHigh = (a, b) -> 5.0;
        assertEquals(1.0, new TokenSimilarityScorer(new Tokenizer(), tooHigh, 0.0).score("a", "b"), DELTA);
    }

    @Test
    void rejectsNullArguments() {
        assertThrows(NullPointerException.class, () -> scorer.score(null, "a"));
        assertThrows(NullPointerException.class, () -> scorer.score("a", null));
    }

    @Test
    void rejectsNullCollaborators() {
        assertThrows(NullPointerException.class,
                () -> new TokenSimilarityScorer(null, new SimilarityCalculator(), 0.8));
        assertThrows(NullPointerException.class,
                () -> new TokenSimilarityScorer(new Tokenizer(), null, 0.8));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-0.1, 1.1, Double.NaN})
    void rejectsInvalidThreshold(double threshold) {
        assertThrows(IllegalArgumentException.class,
                () -> new TokenSimilarityScorer(new Tokenizer(), new SimilarityCalculator(), threshold));
    }
}
