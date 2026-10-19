package com.feefo.jobtitles;

import com.feefo.jobtitles.similarity.SimilarityScorer;
import com.feefo.jobtitles.similarity.TokenSimilarityScorer;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

public final class Normaliser {

    public static final List<String> DEFAULT_TITLES =
            List.of("Architect", "Software engineer", "Quantity surveyor", "Accountant");

    public static final double DEFAULT_MINIMUM_SCORE = 0.25;

    private final List<String> normalisedTitles;
    private final SimilarityScorer scorer;
    private final double minimumScore;

    public Normaliser() {
        this(DEFAULT_TITLES);
    }

    public Normaliser(Collection<String> normalisedTitles) {
        this(normalisedTitles, new TokenSimilarityScorer(), DEFAULT_MINIMUM_SCORE);
    }

    public Normaliser(Collection<String> normalisedTitles, SimilarityScorer scorer, double minimumScore) {
        this.normalisedTitles = validateTitles(normalisedTitles);
        this.scorer = Objects.requireNonNull(scorer, "scorer must not be null");
        if (Double.isNaN(minimumScore) || minimumScore <= 0.0 || minimumScore > 1.0) {
            throw new IllegalArgumentException(
                    "minimumScore must be greater than 0.0 and at most 1.0 but was " + minimumScore);
        }
        this.minimumScore = minimumScore;
    }

    public String normalise(String jobTitle) {
        return match(jobTitle)
                .map(Match::title)
                .orElseGet(jobTitle::trim);
    }

    public Optional<Match> match(String jobTitle) {
        Objects.requireNonNull(jobTitle, "jobTitle must not be null");
        if (jobTitle.isBlank()) {
            throw new IllegalArgumentException("jobTitle must not be blank");
        }

        Match best = null;
        for (String candidate : normalisedTitles) {
            double score = scoreOf(jobTitle, candidate);
            // Strictly greater: on a tie the earlier title in the list is kept.
            if (best == null || score > best.score()) {
                best = new Match(candidate, score);
            }
        }
        return best.score() >= minimumScore ? Optional.of(best) : Optional.empty();
    }

    public List<String> getNormalisedTitles() {
        return normalisedTitles;
    }

    private double scoreOf(String jobTitle, String candidate) {
        double score = scorer.score(jobTitle, candidate);
        if (Double.isNaN(score) || score < 0.0 || score > 1.0) {
            throw new IllegalStateException(
                    "Scorer returned " + score + " for '" + jobTitle + "' vs '" + candidate
                            + "'; scores must be between 0.0 and 1.0");
        }
        return score;
    }

    private static List<String> validateTitles(Collection<String> titles) {
        Objects.requireNonNull(titles, "normalisedTitles must not be null");
        if (titles.isEmpty()) {
            throw new IllegalArgumentException("normalisedTitles must not be empty");
        }

        List<String> validated = new ArrayList<>(titles.size());
        Set<String> seen = new HashSet<>();
        for (String title : titles) {
            if (title == null || title.isBlank()) {
                throw new IllegalArgumentException("normalisedTitles must not contain null or blank titles");
            }
            String trimmed = title.trim();
            if (!seen.add(trimmed.toLowerCase(Locale.ROOT))) {
                throw new IllegalArgumentException("Duplicate normalised title: '" + trimmed + "'");
            }
            validated.add(trimmed);
        }
        return List.copyOf(validated);
    }
}
