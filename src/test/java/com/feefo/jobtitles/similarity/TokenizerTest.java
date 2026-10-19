package com.feefo.jobtitles.similarity;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TokenizerTest {

    private final Tokenizer tokenizer = new Tokenizer();

    @Test
    void lowerCasesAndSplitsOnWhitespace() {
        assertEquals(List.of("software", "engineer"), tokenizer.tokenize("Software Engineer"));
    }

    @Test
    void ignoresLeadingTrailingAndRepeatedSeparators() {
        assertEquals(List.of("chief", "accountant"), tokenizer.tokenize("  Chief,  - Accountant!! "));
    }

    @Test
    void keepsProgrammingLanguageSymbols() {
        assertEquals(List.of("c#", "c++", "engineer"), tokenizer.tokenize("C#/C++ Engineer"));
    }

    @Test
    void keepsDigitsAndNonAsciiLetters() {
        assertEquals(List.of("level", "2", "ingénieur"), tokenizer.tokenize("Level 2 Ingénieur"));
    }

    @Test
    void returnsEmptyListWhenThereAreNoWords() {
        assertTrue(tokenizer.tokenize("").isEmpty());
        assertTrue(tokenizer.tokenize(" .,;- ").isEmpty());
    }

    @Test
    void rejectsNull() {
        assertThrows(NullPointerException.class, () -> tokenizer.tokenize(null));
    }
}
