package com.feefo.jobtitles.similarity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SimilarityCalculatorTest {

    private final SimilarityCalculator similarity = new SimilarityCalculator();

    @ParameterizedTest(name = "distance(\"{0}\", \"{1}\") = {2}")
    @CsvSource({
            "kitten,    sitting,    3",
            "flaw,      lawn,       2",
            "accountant, acountant, 1",
            "engineer,  engineers,  1",
            "same,      same,       0",
            "'',        abc,        3",
            "abc,       '',         3",
    })
    void computesEditDistance(String first, String second, int expected) {
        assertEquals(expected, SimilarityCalculator.distance(first, second));
    }

    @Test
    void identicalStringsScoreOne() {
        assertEquals(1.0, similarity.score("engineer", "engineer"));
    }

    @Test
    void twoEmptyStringsScoreOne() {
        assertEquals(1.0, similarity.score("", ""));
    }

    @Test
    void completelyDifferentStringsScoreZero() {
        assertEquals(0.0, similarity.score("abc", "xyz"));
    }

    @Test
    void scoreIsNormalisedByLongerLength() {
        assertEquals(0.9, similarity.score("acountant", "accountant"), 1e-9);
    }

    @Test
    void isSymmetric() {
        assertEquals(similarity.score("kitten", "sitting"), similarity.score("sitting", "kitten"));
    }

    @Test
    void rejectsNulls() {
        assertThrows(NullPointerException.class, () -> similarity.score(null, "a"));
        assertThrows(NullPointerException.class, () -> similarity.score("a", null));
    }
}
