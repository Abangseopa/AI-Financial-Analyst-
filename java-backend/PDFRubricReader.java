/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.pdfrubricreader;

/**
 *
 * @author abangseopa
*/ 

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import javax.swing.*;
import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PDFRubricReader extends JFrame {
    private JTextArea displayArea;
    private JButton openButton;
    private JComboBox<String> yearSelector;
    private JLabel selectedFileLabel;

    public PDFRubricReader() {
        // Set up the frame
        setTitle("SG&A Margin Calculator");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Create components
        displayArea = new JTextArea();
        displayArea.setEditable(false);
        displayArea.setFont(new Font("Monospaced", Font.PLAIN, 14));
        displayArea.setMargin(new Insets(10, 10, 10, 10));

        openButton = new JButton("Open Financial Statement");
        yearSelector = new JComboBox<>(new String[]{"2026E", "2025E", "2024A", "2023A", "2022A"});
        selectedFileLabel = new JLabel("No file selected");
        selectedFileLabel.setForeground(Color.GRAY);

        // Layout
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        topPanel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        topPanel.add(new JLabel("Select Year:"));
        topPanel.add(yearSelector);
        topPanel.add(openButton);

        JPanel filePanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        filePanel.add(selectedFileLabel);

        setLayout(new BorderLayout(5, 5));
        add(topPanel, BorderLayout.NORTH);
        add(new JScrollPane(displayArea), BorderLayout.CENTER);
        add(filePanel, BorderLayout.SOUTH);

        // Add button action
        openButton.addActionListener(e -> openPDF());
    }

    private void openPDF() {
        String selectedYear = (String) yearSelector.getSelectedItem();
        
        JFileChooser fileChooser = new JFileChooser(System.getProperty("user.home"));
        fileChooser.setFileFilter(new javax.swing.filechooser.FileFilter() {
            public boolean accept(File f) {
                return f.getName().toLowerCase().endsWith(".pdf") || f.isDirectory();
            }
            public String getDescription() {
                return "PDF Files (*.pdf)";
            }
        });

        try {
            int result = fileChooser.showOpenDialog(this);
            if (result == JFileChooser.APPROVE_OPTION) {
                File selectedFile = fileChooser.getSelectedFile();
                selectedFileLabel.setText("Selected: " + selectedFile.getName());
                processFinancials(selectedFile, selectedYear);
            }
        } catch (Exception e) {
            showError("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void processFinancials(File file, String selectedYear) {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            // Extract values
            double[] values = extractFinancialData(text, selectedYear);
            double revenue = values[0];
            double sga = values[1];

            if (revenue <= 0) {
                throw new IOException("Could not find Revenue for " + selectedYear);
            }
            if (sga <= 0) {
                throw new IOException("Could not find SG&A for " + selectedYear);
            }

            // Calculate SG&A margin
            double sgaMargin = (sga / revenue) * 100;

            // Display results
            StringBuilder result = new StringBuilder();
            result.append("Financial Analysis for ").append(selectedYear).append("\n");
            result.append("=====================================\n\n");
            result.append(String.format("Revenue: $%.1f million\n", revenue));
            result.append(String.format("SG&A: $%.1f million\n", sga));
            result.append(String.format("SG&A Margin: %.2f%%\n", sgaMargin));

            displayArea.setText(result.toString());
            displayArea.setCaretPosition(0);

        } catch (IOException e) {
            showError("Error reading PDF: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private double[] extractFinancialData(String text, String year) {
        double[] results = new double[2]; // [revenue, sga]
        String[] lines = text.split("\\n");
        
        int yearIndex = getYearIndex(year);
        
        for (String line : lines) {
            line = line.trim();
            if (line.startsWith("Revenue")) {
                results[0] = extractValueForYear(line, yearIndex);
            } else if (line.contains("SG&A")) {
                results[1] = extractValueForYear(line, yearIndex);
            }
        }
        
        return results;
    }

    private int getYearIndex(String year) {
        switch (year) {
            case "2026E": return 0;
            case "2025E": return 1;
            case "2024A": return 2;
            case "2023A": return 3;
            case "2022A": return 4;
            default: return 0;
        }
    }

    private double extractValueForYear(String line, int yearIndex) {
        String[] parts = line.split("\\s+");
        for (int i = 0; i < parts.length; i++) {
            try {
                return Double.parseDouble(parts[i].replace(",", ""));
            } catch (NumberFormatException e) {
                continue;
            }
        }
        return -1;
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Error", JOptionPane.ERROR_MESSAGE);
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        SwingUtilities.invokeLater(() -> {
            PDFRubricReader reader = new PDFRubricReader();
            reader.setLocationRelativeTo(null);
            reader.setVisible(true);
        });
    }
}
