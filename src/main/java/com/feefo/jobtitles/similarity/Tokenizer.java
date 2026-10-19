package com.feefo.jobtitles.similarity;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

public final class Tokenizer {

    // '#' and '+' are not separators, so "C#" and "C++" stay whole words.
    private static final Pattern SEPARATORS = Pattern.compile("[^\\p{L}\\p{N}#+]+");

    public List<String> tokenize(String text) {
        Objects.requireNonNull(text, "text must not be null");
        return Arrays.stream(SEPARATORS.split(text.toLowerCase(Locale.ROOT)))
                .filter(token -> !token.isEmpty())
                .toList();
    }
}
