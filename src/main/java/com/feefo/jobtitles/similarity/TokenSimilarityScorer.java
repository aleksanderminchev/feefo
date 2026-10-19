package com.feefo.jobtitles.similarity;

import java.util.List;
import java.util.Objects;

public final class TokenSimilarityScorer implements SimilarityScorer {

    public static final double DEFAULT_MINIMUM_TOKEN_SIMILARITY = 0.8;

    private final Tokenizer tokenizer;
    private final SimilarityScorer tokenScorer;
    private final double minimumTokenSimilarity;

    public TokenSimilarityScorer() {
        this(new Tokenizer(), new SimilarityCalculator(), DEFAULT_MINIMUM_TOKEN_SIMILARITY);
    }

    public TokenSimilarityScorer(Tokenizer tokenizer, SimilarityScorer tokenScorer, double minimumTokenSimilarity) {
        this.tokenizer = Objects.requireNonNull(tokenizer, "tokenizer must not be null");
        this.tokenScorer = Objects.requireNonNull(tokenScorer, "tokenScorer must not be null");
        if (Double.isNaN(minimumTokenSimilarity) || minimumTokenSimilarity < 0.0 || minimumTokenSimilarity > 1.0) {
            throw new IllegalArgumentException(
                    "minimumTokenSimilarity must be between 0.0 and 1.0 but was " + minimumTokenSimilarity);
        }
        this.minimumTokenSimilarity = minimumTokenSimilarity;
    }

    @Override
    public double score(String first, String second) {
        Objects.requireNonNull(first, "first must not be null");
        Objects.requireNonNull(second, "second must not be null");

        List<String> firstTokens = tokenizer.tokenize(first);
        List<String> secondTokens = tokenizer.tokenize(second);
        if (firstTokens.isEmpty() || secondTokens.isEmpty()) {
            return 0.0;
        }

        double matched = sumOfBestMatches(firstTokens, secondTokens) + sumOfBestMatches(secondTokens, firstTokens);
        return clamp(matched / (firstTokens.size() + secondTokens.size()));
    }

    private double sumOfBestMatches(List<String> sources, List<String> targets) {
        double sum = 0.0;
        for (String source : sources) {
            sum += bestMatch(source, targets);
        }
        return sum;
    }

    private double bestMatch(String source, List<String> targets) {
        double best = 0.0;
        for (String target : targets) {
            best = Math.max(best, tokenScorer.score(source, target));
        }
        return best >= minimumTokenSimilarity ? best : 0.0;
    }

    private static double clamp(double value) {
        return Math.max(0.0, Math.min(1.0, value));
    }
}
