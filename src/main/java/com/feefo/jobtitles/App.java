package com.feefo.jobtitles;

import java.util.List;

public final class App {

    private static final List<String> SAMPLE_TITLES =
            List.of("Java engineer", "C# engineer", "Accountant", "Chief Accountant",
                    "Acountant", "SOFTWARE ENGINEERS", "Lead architect", "Senior Quantity Surveyor",
                    "Accountant Chief", "Engineer Software", "Mid level engineer", "Astronaut");

    private App() {
    }

    public static void main(String[] args) {
        List<String> inputs = args.length > 0 ? List.of(args) : SAMPLE_TITLES;
        Normaliser normaliser = new Normaliser();

        for (String input : inputs) {
            if (input.isBlank()) {
                System.out.printf("%-28s -> (skipped: blank input)%n", '"' + input + '"');
                continue;
            }
            String result = normaliser.match(input)
                    .map(match -> String.format("\"%s\" (q=%.2f)", match.title(), match.score()))
                    .orElse("(no match)");
            System.out.printf("%-28s -> %s%n", '"' + input + '"', result);
        }
    }
}
