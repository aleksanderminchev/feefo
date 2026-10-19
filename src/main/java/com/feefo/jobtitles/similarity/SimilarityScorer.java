package com.feefo.jobtitles.similarity;

@FunctionalInterface
public interface SimilarityScorer {

    // Returns a score from 0.0 (nothing in common) to 1.0 (identical).
    double score(String first, String second);
}
