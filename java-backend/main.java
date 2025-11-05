package com.mycompany.pdfrubricreader;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public class Main {
    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } 
        catch (Exception ignored) {}

        SwingUtilities.invokeLater(() -> {
            PDFRubricReader app = new PDFRubricReader();
            app.setLocationRelativeTo(null);
            app.setVisible(true);
        });
    }
}
