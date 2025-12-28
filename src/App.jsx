import React, { useState } from 'react';
import CsvUploader from './components/CsvUploader';
import Scene from './components/Scene';
import { Leva, useControls, buttonGroup } from 'leva';
import Papa from 'papaparse';

import { FaPalette, FaWater, FaLeaf, FaCloudSun, FaGem, FaCircleHalfStroke } from 'react-icons/fa6';

function App() {
  const [data, setData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [themeName, setThemeName] = useState('Playful');

  const { darkMode, isometric } = useControls({
    darkMode: { value: true, label: 'Dark Mode' },
    isometric: { value: true, label: 'Isometric View' }
  });

  const themes = [
    { name: 'Playful', icon: FaPalette, color: '#FF6B6B' },
    { name: 'Ocean', icon: FaWater, color: '#4D96FF' },
    { name: 'Nature', icon: FaLeaf, color: '#6BCB77' },
    { name: 'Sunset', icon: FaCloudSun, color: '#FFD93D' },
    { name: 'Berry', icon: FaGem, color: '#9D44C0' },
    { name: 'Mono', icon: FaCircleHalfStroke, color: '#888888' },
  ];

  const viewMode = isometric ? 'Isometric' : 'Perspective';

  const handleUpload = (parsedData, parsedHeaders) => {
    // Filter out empty rows or invalid data if needed
    const validData = parsedData.filter(row => Object.keys(row).length > 0);
    setData(validData);
    setHeaders(parsedHeaders);
  };

  const handleReset = () => {
    setData(null);
    setHeaders([]);
  };

  // Default Data
  const DEFAULT_DATA = `Country,Year,GDP
미국,2010,15000
미국,2011,15500
미국,2012,16200
미국,2013,16800
미국,2014,17500
미국,2015,18200
미국,2016,18700
미국,2017,19500
미국,2018,20500
미국,2019,21400
미국,2020,20900
미국,2021,23000
미국,2022,25500
미국,2023,27000
미국,2024,28000
중국,2010,6000
중국,2011,7500
중국,2012,8500
중국,2013,9600
중국,2014,10500
중국,2015,11000
중국,2016,11200
중국,2017,12200
중국,2018,13600
중국,2019,14300
중국,2020,14700
중국,2021,17700
중국,2022,18000
중국,2023,17800
중국,2024,18500
일본,2010,5700
일본,2011,6100
일본,2012,6200
일본,2013,5200
일본,2014,4800
일본,2015,4400
일본,2016,5000
일본,2017,4900
일본,2018,5000
일본,2019,5100
일본,2020,5000
일본,2021,4900
일본,2022,4200
일본,2023,4200
일본,2024,4100
독일,2010,3400
독일,2011,3700
독일,2012,3500
독일,2013,3700
독일,2014,3900
독일,2015,3400
독일,2016,3500
독일,2017,3700
독일,2018,4000
독일,2019,3900
독일,2020,3800
독일,2021,4200
독일,2022,4000
독일,2023,4400
독일,2024,4500
영국,2010,2400
영국,2011,2600
영국,2012,2700
영국,2013,2800
영국,2014,3000
영국,2015,2900
영국,2016,2700
영국,2017,2600
영국,2018,2800
영국,2019,2800
영국,2020,2700
영국,2021,3100
영국,2022,3000
영국,2023,3300
영국,2024,3400
프랑스,2010,2600
프랑스,2011,2800
프랑스,2012,2700
프랑스,2013,2800
프랑스,2014,2900
프랑스,2015,2400
프랑스,2016,2500
프랑스,2017,2600
프랑스,2018,2800
프랑스,2019,2700
프랑스,2020,2600
프랑스,2021,2900
프랑스,2022,2700
프랑스,2023,3000
프랑스,2024,3100
이탈리아,2010,2100
이탈리아,2011,2200
이탈리아,2012,2000
이탈리아,2013,2100
이탈리아,2014,2100
이탈리아,2015,1800
이탈리아,2016,1900
이탈리아,2017,2000
이탈리아,2018,2100
이탈리아,2019,2000
이탈리아,2020,1900
이탈리아,2021,2100
이탈리아,2022,2000
이탈리아,2023,2200
이탈리아,2024,2300
캐나다,2010,1600
캐나다,2011,1800
캐나다,2012,1800
캐나다,2013,1800
캐나다,2014,1800
캐나다,2015,1500
캐나다,2016,1500
캐나다,2017,1600
캐나다,2018,1700
캐나다,2019,1700
캐나다,2020,1600
캐나다,2021,2000
캐나다,2022,2100
캐나다,2023,2100
캐나다,2024,2200
대한민국,2010,1100
대한민국,2011,1200
대한민국,2012,1250
대한민국,2013,1300
대한민국,2014,1400
대한민국,2015,1450
대한민국,2016,1500
대한민국,2017,1600
대한민국,2018,1700
대한민국,2019,1650
대한민국,2020,1640
대한민국,2021,1800
대한민국,2022,1700
대한민국,2023,1750
대한민국,2024,1800`;

  // Auto-load default data
  React.useEffect(() => {
    Papa.parse(DEFAULT_DATA, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validData = results.data.filter(row => Object.keys(row).length > 0);
        setData(validData);
        setHeaders(results.meta.fields);
      }
    });
  }, []);

  return (
    <>
      <Leva collapsed={false} />

      {!data ? (
        <CsvUploader onUpload={handleUpload} />
      ) : (
        <>
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
            <button
              onClick={handleReset}
              style={{
                background: darkMode ? '#ff4d4d' : '#ff6b6b',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Upload New File
            </button>
            <div style={{
              marginTop: '10px',
              color: darkMode ? 'white' : '#333',
              background: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
              padding: '5px',
              borderRadius: '4px'
            }}>
              Records: {data.length}
            </div>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '15px',
            background: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
            padding: '15px 25px',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            transition: 'all 0.3s ease'
          }}>
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setThemeName(theme.name)}
                style={{
                  background: themeName === theme.name ? theme.color : 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: themeName === theme.name ? '#fff' : (darkMode ? '#ddd' : '#555'),
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '1.2rem',
                  transform: themeName === theme.name ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: themeName === theme.name ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = themeName === theme.name ? theme.color : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = themeName === theme.name ? 'scale(1.1)' : 'scale(1)';
                  e.currentTarget.style.background = themeName === theme.name ? theme.color : 'transparent';
                }}
                title={theme.name}
              >
                <theme.icon />
              </button>
            ))}
          </div>
          <Scene data={data} darkMode={darkMode} viewMode={viewMode} themeName={themeName} />
        </>
      )}
    </>
  );
}

export default App;
