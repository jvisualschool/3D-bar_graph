import React, { useMemo, useState, Suspense, useEffect } from 'react';
import { Text, Html, Line, Text3D, Center } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { TTFLoader } from 'three-stdlib';
import { FontLoader } from 'three-stdlib';

// Error Boundary for font loading
class FontErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.warn('Font loading error caught:', error);
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn('Font Error Boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render children without font
            return this.props.children;
        }
        return this.props.children;
    }
}

const THEMES_DARK = {
    Playful: ['#FFEA00', '#FF9100', '#FF3D00', '#00E676', '#00B0FF', '#651FFF', '#D500F9', '#3D5AFE'], // Vibrant Yellow, Orange, Red, Green, Cyan, Purple, Magenta, Indigo
    Ocean: ['#48dbfb', '#0abde3', '#54a0ff', '#5f27cd', '#48dbfb', '#0abde3', '#54a0ff', '#5f27cd'], // Brighter Blue
    Nature: ['#55efc4', '#00b894', '#81ecec', '#00cec9', '#55efc4', '#00b894', '#81ecec', '#00cec9'],
    Sunset: ['#f1c40f', '#f39c12', '#e67e22', '#d35400', '#f1c40f', '#f39c12', '#e67e22', '#d35400'],
    Berry: ['#fd79a8', '#e84393', '#a29bfe', '#6c5ce7', '#fd79a8', '#e84393', '#a29bfe', '#6c5ce7'],
    Mono: ['#b2bec3', '#dfe6e9', '#636e72', '#b2bec3', '#dfe6e9', '#636e72', '#b2bec3', '#dfe6e9'] // Removed dark grey #2d3436
};

const THEMES_LIGHT = {
    Playful: ['#FFEA00', '#FF9100', '#FF3D00', '#00E676', '#00B0FF', '#651FFF', '#D500F9', '#3D5AFE'], // Keep vibrant colors for Light mode too
    Ocean: ['#00a8ff', '#0097e6', '#273c75', '#192a56', '#00a8ff', '#0097e6', '#273c75', '#192a56'], // Deeper Blues
    Nature: ['#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#00b894', '#00cec9', '#0984e3', '#6c5ce7'], // Stronger Greens/Teals
    Sunset: ['#e1b12c', '#e67e22', '#d35400', '#c0392b', '#e1b12c', '#e67e22', '#d35400', '#c0392b'], // Darker Warm tones
    Berry: ['#e84393', '#d63031', '#6c5ce7', '#2d3436', '#e84393', '#d63031', '#6c5ce7', '#2d3436'], // Deep Pink/Purple
    Mono: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9', '#2d3436', '#636e72', '#b2bec3', '#dfe6e9'] // Darker Mono
};

// Load font once at module level
let cachedFont = null;
const loadFont = () => {
    if (cachedFont) return cachedFont;
    return null; // Will be loaded in BarGraph component
};

// New improved axis label component with better visibility and error handling
const AxisLabel = React.memo(({ children, position, rotation, fontSize = 1.0, color, darkMode }) => {
    try {
        const textColor = color || (darkMode ? '#ffffff' : '#000000');
        const bgColor = darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.98)';
        const actualFontSize = fontSize * 40;
        
        if (!children && children !== 0) return null;
        
        return (
            <group position={position} rotation={rotation}>
                <Html
                    center
                    distanceFactor={4}
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{
                        color: textColor,
                        fontSize: `${actualFontSize}px`,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        background: bgColor,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: `2px solid ${textColor}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 1)',
                        lineHeight: '1.2',
                        display: 'inline-block',
                        userSelect: 'none',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {String(children)}
                    </div>
                </Html>
            </group>
        );
    } catch (error) {
        console.warn('AxisLabel error:', error);
        return null;
    }
}, (prevProps, nextProps) => {
    // Custom comparison for memo
    return prevProps.children === nextProps.children &&
           prevProps.darkMode === nextProps.darkMode &&
           prevProps.fontSize === nextProps.fontSize &&
           JSON.stringify(prevProps.position) === JSON.stringify(nextProps.position);
});

const Bar = ({ position, height, color, label, value, size = 0.8, onHover }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            <mesh
                position={[0, height / 2, 0]}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    onHover({ label, value });
                }}
                onPointerOut={(e) => {
                    setHovered(false);
                    onHover(null);
                }}
            >
                <boxGeometry args={[size, height, size]} />
                <meshStandardMaterial color={hovered ? '#ffffff' : color} emissive={hovered ? color : '#000000'} emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
};

// Font loader component with error handling
// Note: useLoader must be called unconditionally (React hook rules)
const FontLoaderComponent = ({ fontUrl, onFontLoaded }) => {
    // useLoader will throw if font fails to load, which Suspense will catch
    const json = useLoader(TTFLoader, fontUrl);

    const font = useMemo(() => {
        if (!json) {
            if (onFontLoaded) onFontLoaded(null);
            return null;
        }
        try {
            const parsedFont = new FontLoader().parse(json);
            if (onFontLoaded) onFontLoaded(parsedFont);
            return parsedFont;
        } catch (e) {
            console.warn('Font parsing error:', e);
            if (onFontLoaded) onFontLoaded(null);
            return null;
        }
    }, [json, onFontLoaded]);
    return null;
};

const BarGraph = ({ data, darkMode, themeName = 'Playful' }) => {
    // Don't load font - use HTML text instead to avoid loading issues
    const font = null;

    // Calculate text scale based on camera distance/zoom
    const { camera } = useThree();
    // Removed manual text scaling logic to fix zoom issue

    // Safety check
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('BarGraph: No valid data provided');
        return null;
    }

    const { barScale, gridSpacingX, gridSpacingZ, title, barSize, showGrid } = useControls({
        barScale: { value: 1.0, min: 0.1, max: 5, step: 0.1 },
        gridSpacingX: { value: 2, min: 1, max: 5, step: 0.1, label: 'Country Spacing' },
        gridSpacingZ: { value: 2.0, min: 1, max: 5, step: 0.1, label: 'Year Spacing' },
        barSize: { value: 0.6, min: 0.1, max: 1, step: 0.05, label: 'Bar Thickness' },
        showGrid: { value: true, label: 'Show Grid Lines' },
        title: { value: 'G7 GDP Growth' }
    });

    const [hoveredData, setHoveredData] = useState(null);

    // Process Data
    const { processedData, uniqueCountries, uniqueYears, maxValue, minValue } = useMemo(() => {
        if (!data || data.length === 0) {
            console.log('BarGraph: No data provided');
            return { processedData: [], uniqueCountries: [], uniqueYears: [], maxValue: 0, minValue: 0 };
        }
        console.log('BarGraph: Processing data', { dataLength: data.length, firstRow: data[0] });

        // Assume format: Country, Year, Value
        // Or detect keys
        const keys = Object.keys(data[0]);
        const countryKey = keys.find(k => k.toLowerCase().includes('country')) || keys[0];
        const yearKey = keys.find(k => k.toLowerCase().includes('year')) || keys[1];
        const valueKey = keys.find(k => k.toLowerCase().includes('gdp') || k.toLowerCase().includes('value')) || keys[2];

        const countries = [...new Set(data.map(d => d[countryKey]))]; // Original order
        const years = [...new Set(data.map(d => d[yearKey]))].sort();

        const values = data.map(d => Number(d[valueKey]) || 0);
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);

        const processed = data.map(item => {
            const countryIndex = countries.indexOf(item[countryKey]);
            const yearIndex = years.indexOf(item[yearKey]);
            return {
                ...item,
                countryIndex,
                yearIndex,
                value: Number(item[valueKey]),
                country: item[countryKey],
                year: item[yearKey]
            };
        });

        console.log('BarGraph: Processed data', {
            countries: countries.length,
            years: years.length,
            maxValue: maxVal,
            processedCount: processed.length
        });
        return { processedData: processed, uniqueCountries: countries, uniqueYears: years, maxValue: maxVal, minValue: minVal };
    }, [data]);

    const bars = useMemo(() => {
        const currentTheme = darkMode ? THEMES_DARK[themeName] : THEMES_LIGHT[themeName];

        return processedData.map((item, index) => {
            // Normalize height
            const normalizedHeight = maxValue > 0 ? (item.value / maxValue) * 10 : 0;
            const height = Math.max(0.1, normalizedHeight * barScale);

            // Position
            // Swap: X = Year, Z = Country
            const x = (item.yearIndex - (uniqueYears.length - 1) / 2) * gridSpacingX;
            const z = (item.countryIndex - (uniqueCountries.length - 1) / 2) * gridSpacingZ;

            // Color based on country index
            const color = currentTheme[item.countryIndex % currentTheme.length];

            return {
                id: index,
                position: [x, 0, z],
                height,
                color,
                label: `${item.country} (${item.year})`,
                value: item.value.toLocaleString()
            };
        });
    }, [processedData, maxValue, barScale, gridSpacingX, gridSpacingZ, themeName, uniqueCountries.length, uniqueYears.length]);

    // Calculate Vertical Ticks
    const verticalTicks = useMemo(() => {
        if (maxValue === 0) return [];
        const tickCount = 5;
        const ticks = [];
        for (let i = 0; i <= tickCount; i++) {
            const val = (maxValue / tickCount) * i;
            const y = (val / maxValue) * 10 * barScale;
            ticks.push({ value: Math.round(val), y });
        }
        return ticks;
    }, [maxValue, barScale]);

    // Calculate Grid Bounds
    const gridBounds = useMemo(() => {
        const xStart = -((uniqueYears.length - 1) / 2) * gridSpacingX - 2;
        const zStart = -((uniqueCountries.length - 1) / 2) * gridSpacingZ - 2;
        const xEnd = ((uniqueYears.length - 1) / 2) * gridSpacingX + 2;
        const zEnd = ((uniqueCountries.length - 1) / 2) * gridSpacingZ + 2;
        return { xStart, zStart, xEnd, zEnd };
    }, [uniqueYears.length, uniqueCountries.length, gridSpacingX, gridSpacingZ]);

    // Safety check
    if (!processedData || processedData.length === 0 || !uniqueCountries || !uniqueYears) {
        console.warn('BarGraph: Invalid processed data');
        return null;
    }

    return (
        <>
            <group>
                {bars.map((bar) => (
                    <Bar
                        key={bar.id}
                        position={bar.position}
                        height={bar.height}
                        color={bar.color}
                        label={bar.label}
                        value={bar.value}
                        size={barSize}
                        onHover={setHoveredData}
                    />
                ))}

                {/* Year Labels (X-axis) */}
                {uniqueYears && uniqueYears.length > 0 && uniqueYears.map((year, i) => {
                    const x = (i - (uniqueYears.length - 1) / 2) * gridSpacingX;
                    const zPos = ((uniqueCountries.length - 1) / 2) * gridSpacingZ + 3;
                    return (
                        <Text
                            key={`year-${i}`}
                            position={[x, 0.1, zPos]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            fontSize={0.6}
                            color={darkMode ? "#ffffff" : "#333333"}
                            anchorX="center"
                            anchorY="middle"
                        >
                            {year}
                        </Text>
                    );
                })}

                {/* Country Labels (Z-axis) - Right side */}
                {uniqueCountries && uniqueCountries.length > 0 && uniqueCountries.map((country, i) => {
                    const z = (i - (uniqueCountries.length - 1) / 2) * gridSpacingZ;
                    const xPosRight = ((uniqueYears.length - 1) / 2) * gridSpacingX + 3;
                    const xPosLeft = -((uniqueYears.length - 1) / 2) * gridSpacingX - 3;
                    return (
                        <React.Fragment key={`country-${i}`}>
                            {/* Right side label */}
                            <Text
                                position={[xPosRight, 0.1, z]}
                                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                                fontSize={0.6}
                                color={darkMode ? "#ffffff" : "#333333"}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {country}
                            </Text>
                            {/* Left side label - horizontal */}
                            <Text
                                position={[xPosLeft, 0.1, z]}
                                rotation={[-Math.PI / 2, 0, 0]}
                                fontSize={0.6}
                                color={darkMode ? "#ffffff" : "#333333"}
                                anchorX="center"
                                anchorY="middle"
                            >
                                {country}
                            </Text>
                        </React.Fragment>
                    );
                })}

                {/* Vertical Value Ticks & Grid Lines */}
                {showGrid && verticalTicks.map((tick, i) => {
                    const { xStart, zStart, xEnd, zEnd } = gridBounds;
                    return (
                        <React.Fragment key={`v-tick-${i}`}>
                            {/* Horizontal Grid Line */}
                            <Line
                                points={[
                                    [xStart, tick.y, zStart],
                                    [xEnd, tick.y, zStart],
                                    [xEnd, tick.y, zEnd],
                                    [xStart, tick.y, zEnd],
                                    [xStart, tick.y, zStart]
                                ]}
                                color={darkMode ? "#444" : "#ccc"}
                                lineWidth={1}
                            />

                            {/* Start Corner Tick */}
                            <mesh position={[xStart, tick.y, zStart]}>
                                <boxGeometry args={[0.5, 0.05, 0.05]} />
                                <meshStandardMaterial color={darkMode ? "#aaa" : "#666"} />
                            </mesh>
                            {/* Y-axis Value Label */}
                            <Text
                                position={[xStart - 1.5, tick.y, zStart]}
                                rotation={[0, Math.PI / 4, 0]}
                                fontSize={0.5}
                                color={darkMode ? "#ffffff" : "#333333"}
                                anchorX="right"
                                anchorY="middle"
                            >
                                {tick.value.toLocaleString()}
                            </Text>

                            {/* End Corner Tick */}
                            <mesh position={[xEnd, tick.y, zEnd]}>
                                <boxGeometry args={[0.5, 0.05, 0.05]} />
                                <meshStandardMaterial color={darkMode ? "#aaa" : "#666"} />
                            </mesh>
                        </React.Fragment>
                    );
                })}

                {/* Floor Grid */}
                <gridHelper
                    args={[
                        Math.max(uniqueCountries.length * gridSpacingX, uniqueYears.length * gridSpacingZ) + 5,
                        20,
                        darkMode ? 0x444444 : 0xbbbbbb,
                        darkMode ? 0x222222 : 0xe8e8e8
                    ]}
                    position={[0, 0.01, 0]}
                />

                {/* Dark Floor Plate */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                    <planeGeometry args={[
                        Math.max(uniqueCountries.length * gridSpacingX, uniqueYears.length * gridSpacingZ) + 10,
                        Math.max(uniqueCountries.length * gridSpacingX, uniqueYears.length * gridSpacingZ) + 10
                    ]} />
                    <meshStandardMaterial
                        color={darkMode ? '#121212' : '#888888'}
                        transparent
                        opacity={0.5}
                        roughness={0.8}
                    />
                </mesh>

                {/* Chart Title */}
                <Text
                    position={[
                        0,
                        10 * barScale * 0.85, // Positioned 15% below the top (Max height 10)
                        -((uniqueCountries.length * gridSpacingZ) / 2) - 2 // Moved to US side (Negative Z)
                    ]}
                    rotation={[0, 0, 0]} // Face Front
                    fontSize={1.5}
                    color={darkMode ? "white" : "#333"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {title}
                </Text>
            </group>

            {hoveredData && (
                <Html position={[0, 5, 0]} center style={{ pointerEvents: 'none', zIndex: 1000 }}>
                    <div style={{
                        background: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        color: darkMode ? 'white' : 'black',
                        whiteSpace: 'nowrap',
                        border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '0.8em', color: darkMode ? '#aaa' : '#666' }}>{hoveredData.label}</div>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>${hoveredData.value}</div>
                    </div>
                </Html>
            )}
        </>
    );
};

export default BarGraph;
