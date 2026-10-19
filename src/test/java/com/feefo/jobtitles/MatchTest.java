package com.feefo.jobtitles;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class MatchTest {

    @ParameterizedTest
    @ValueSource(doubles = {0.0, 0.5, 1.0})
    void acceptsScoresInRange(double score) {
        assertDoesNotThrow(() -> new Match("Accountant", score));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-0.01, 1.01, Double.NaN, Double.POSITIVE_INFINITY})
    void rejectsScoresOutOfRange(double score) {
        assertThrows(IllegalArgumentException.class, () -> new Match("Accountant", score));
    }

    @Test
    void rejectsNullTitle() {
        assertThrows(NullPointerException.class, () -> new Match(null, 0.5));
    }
}
