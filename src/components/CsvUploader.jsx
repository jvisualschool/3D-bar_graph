import React, { useCallback } from 'react';
import Papa from 'papaparse';

const CsvUploader = ({ onUpload }) => {
    const handleFile = useCallback((file) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                onUpload(results.data, results.meta.fields);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file.');
            }
        });
    }, [onUpload]);

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            handleFile(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                border: '2px dashed #666',
                color: 'white',
                minWidth: '300px'
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <h2>Upload CSV</h2>
            <p>Drag & Drop your CSV file here</p>
            <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '1rem 0' }}>or</p>
            <input
                type="file"
                accept=".csv"
                onChange={onInputChange}
                style={{ display: 'none' }}
                id="csv-input"
            />
            <label
                htmlFor="csv-input"
                style={{
                    background: '#646cff',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'inline-block'
                }}
            >
                Browse File
            </label>
        </div>
    );
};

export default CsvUploader;
