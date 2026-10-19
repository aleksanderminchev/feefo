package com.feefo.jobtitles;

import java.util.Objects;

public record Match(String title, double score) {

    public Match {
        Objects.requireNonNull(title, "title must not be null");
        if (Double.isNaN(score) || score < 0.0 || score > 1.0) {
            throw new IllegalArgumentException("score must be between 0.0 and 1.0 but was " + score);
        }
    }
}
