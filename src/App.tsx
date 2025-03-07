import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { findMostRepeatedConsecutiveCharacters, parseInputFile } from './utils/characterAnalyzer';
import { sortOutputsWithAI } from './utils/openAIClient';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const UploadSection = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 30px;
`;

const FileInput = styled.div`
  margin: 20px 0;
  padding: 30px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f8f8;
  
  &:hover {
    border-color: #666;
    background-color: #f0f0f0;
  }

  label {
    display: block;
    font-size: 1.1em;
    color: #666;
    cursor: pointer;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#cccccc' : '#4CAF50'};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1em;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: ${props => props.disabled ? '#cccccc' : '#45a049'};
  }
`;

const SelectedFile = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileName = styled.span`
  color: #2e7d32;
  font-size: 0.9em;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 30px;
`;

const ResultItem = styled.div`
  background: white;
  padding: 20px;
  margin: 15px 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Label = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const Value = styled.div`
  color: #666;
  font-family: monospace;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #dc3545;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  margin: 40px 0;
  font-style: italic;
`;

interface Result {
  input: string[][];
  output: string[][];
  timestamp: number;
  sortedOutput?: string[][];
}

const MAX_HISTORY_ITEMS = 5;

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('analysisHistory');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('analysisHistory', JSON.stringify(results));
  }, [results]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file');
      return;
    }
    setSelectedFile(file);
    setError('');
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const processFile = useCallback(() => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const inputs = parseInputFile(content);
        
        if (inputs.length === 0) {
          setError('No valid input found in the file');
          return;
        }

        const outputs = inputs.map(input => findMostRepeatedConsecutiveCharacters(input));
        setIsSorting(true);

        try {
          const sortedOutputs = await sortOutputsWithAI(outputs);
          
          const newResult = {
            input: inputs,
            output: outputs,
            sortedOutput: sortedOutputs,
            timestamp: Date.now()
          };
          
          setResults(prevResults => {
            const updatedResults = [newResult, ...prevResults].slice(0, MAX_HISTORY_ITEMS);
            return updatedResults;
          });
        } catch (sortError) {
          console.error('Error sorting with AI:', sortError);
          // Still save results even if sorting fails
          const newResult = {
            input: inputs,
            output: outputs,
            timestamp: Date.now()
          };
          
          setResults(prevResults => {
            const updatedResults = [newResult, ...prevResults].slice(0, MAX_HISTORY_ITEMS);
            return updatedResults;
          });
        } finally {
          setIsSorting(false);
        }

        setError('');
      } catch (err) {
        setError('Error processing file: ' + (err instanceof Error ? err.message : 'Unknown error'));
        setIsSorting(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setIsSorting(false);
    };
    
    reader.readAsText(selectedFile);
  }, [selectedFile]);

  return (
    <Container>
      <Title>Character Sequence Analyzer</Title>
      
      <UploadSection>
        <FileInput
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            borderColor: isDragging ? '#666' : '#ccc',
            backgroundColor: isDragging ? '#f0f0f0' : '#f8f8f8'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            {isDragging ? 'Drop your file here' : 'Drop your text file here or click to upload'}
          </label>
        </FileInput>

        {selectedFile && (
          <SelectedFile>
            <FileName>{selectedFile.name}</FileName>
            <RemoveButton onClick={handleRemoveFile}>Remove</RemoveButton>
          </SelectedFile>
        )}

        <Button 
          onClick={processFile} 
          disabled={!selectedFile || isSorting}
        >
          {!selectedFile ? 'Select a file to process' : 
           isSorting ? 'Processing and sorting...' : 'Process File'}
        </Button>
      </UploadSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ResultsContainer>
        {results.length === 0 ? (
          <EmptyState>Process a file to see the results</EmptyState>
        ) : (
          <>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Latest Results (Last {MAX_HISTORY_ITEMS})</h2>
            {results.map((result) => (
              <ResultItem key={result.timestamp}>
                <div>
                  <Label>Input:</Label>
                  <Value>[{result.input.join(',')}]</Value>
                </div>
                <div>
                  <Label>Original Output:</Label>
                  <Value>[{result.output.join(',')}]</Value>
                </div>
                {result.sortedOutput && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label>AI-Sorted Output:</Label>
                    <Value>[{result.sortedOutput.join(',')}]</Value>
                  </div>
                )}
                <div style={{ gridColumn: '1 / -1', fontSize: '0.8em', color: '#666' }}>
                  Processed: {new Date(result.timestamp).toLocaleString()}
                </div>
              </ResultItem>
            ))}
          </>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default App; 