import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import BarGraph from './BarGraph';


// Error Boundary for the entire scene
class SceneErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        console.error('Scene Error:', error);
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Scene Error Boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Even if there's an error, try to render the scene
            // The error might be from font loading, which we can handle
            return this.props.children;
        }
        return this.props.children;
    }
}

const Scene = ({ data, darkMode, viewMode, themeName }) => {
    return (
        <Canvas shadows>
            <color attach="background" args={[darkMode ? '#242424' : '#f0f0f0']} />


            {viewMode === 'Perspective' ? (
                <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} />
            ) : (
                <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={40} />
            )}

            <OrbitControls makeDefault />

            <ambientLight intensity={darkMode ? 0.5 : 0.7} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={darkMode ? 1 : 1.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <group position={[0, -2, 0]}>
                <SceneErrorBoundary>
                    <Suspense fallback={null}>
                        <BarGraph data={data} darkMode={darkMode} themeName={themeName} />
                    </Suspense>
                </SceneErrorBoundary>
            </group>
        </Canvas>
    );
};

export default Scene;
