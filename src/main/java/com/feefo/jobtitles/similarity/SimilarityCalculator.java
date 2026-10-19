package com.feefo.jobtitles.similarity;

import java.util.Objects;

public final class SimilarityCalculator implements SimilarityScorer {

    @Override
    public double score(String first, String second) {
        Objects.requireNonNull(first, "first must not be null");
        Objects.requireNonNull(second, "second must not be null");

        int longest = Math.max(first.length(), second.length());
        if (longest == 0) {
            return 1.0;
        }
        return 1.0 - (double) distance(first, second) / longest;
    }

    static int distance(String first, String second) {
        int[] previous = new int[second.length() + 1];
        int[] current = new int[second.length() + 1];

        for (int j = 0; j <= second.length(); j++) {
            previous[j] = j;
        }

        for (int i = 1; i <= first.length(); i++) {
            current[0] = i;
            for (int j = 1; j <= second.length(); j++) {
                int substitutionCost = first.charAt(i - 1) == second.charAt(j - 1) ? 0 : 1;
                current[j] = Math.min(
                        Math.min(current[j - 1] + 1, previous[j] + 1),
                        previous[j - 1] + substitutionCost);
            }
            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return previous[second.length()];
    }
}
