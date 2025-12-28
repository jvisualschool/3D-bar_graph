# 3D CSV Visualizer

CSV 데이터를 인터랙티브한 3D 막대 그래프로 시각화하는 React 애플리케이션입니다.  
**Live Demo:** [https://jvibeschool.org/3D_BAR/](https://jvibeschool.org/3D_BAR/)

## ✨ 주요 기능

- **CSV 데이터 시각화**: CSV 파일을 업로드하여 즉시 3D 그래프로 변환
- **다양한 뷰 모드**:
  - **Isometric View**: 데이터 비교에 최적화된 등각 투영 뷰
  - **Perspective View**: 원근감이 살아있는 3D 뷰
- **프리미엄 UI/UX**:
  - Glassmorphism 스타일의 플로팅 테마 선택 도크 (하단)
  - 부드러운 애니메이션 및 호버 효과
- **6가지 색상 테마**:
  - 🎨 Playful (Default)
  - 🌊 Ocean
  - 🌿 Nature
  - 🌅 Sunset
  - 🍇 Berry
  - ⚪ Mono
- **세부 커스터마이징**:
  - 다크/라이트 모드 지원
  - 막대 크기(Scale, Thickness), 간격(Spacing) 조절 가능 (Leva 패널)
- **인터랙션**:
  - 마우스 호버 시 데이터 값 툴팁 표시
  - 360도 자유로운 카메라 회전 및 줌

## 🛠 기술 스택

- **Core**: React 19, Vite
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei
- **UI/Styling**: Leva (Controls), React Icons, Vanilla CSS (Glassmorphism)
- **Data Processing**: PapaParse (CSV Parsing)

## 📂 샘플 데이터

프로젝트 내 `public/` 폴더에 테스트용 샘플 데이터가 포함되어 있습니다.
- `sample_tech_revenue.csv`: 빅테크 기업 매출 추이
- `sample_kpop_sales.csv`: 주요 K-Pop 그룹 앨범 판매량
- `sample_data.csv`: G7 국가 GDP 데이터 (기본 로드)

## 🚀 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📖 사용법

1. **데이터 로드**:
   - 앱 실행 시 기본 GDP 데이터가 로드됩니다.
   - 좌측 상단 **"Upload New File"** 버튼을 클릭하거나 파일을 드래그하여 CSV 파일을 업로드하세요.
   - **CSV 형식**: `Country,Year,Value` (헤더 포함 필수)

2. **테마 변경**:
   - 화면 **하단 중앙의 독(Dock)** 아이콘을 클릭하여 테마를 변경할 수 있습니다.

3. **그래프 설정**:
   - 우측 상단 패널(Leva)에서 세부 설정을 조정하세요.
   - **Dark Mode**: 다크/라이트 모드 전환
   - **Isometric View**: 뷰 모드 전환
   - **Grid Spacing**: 국가/연도 간격 조절
   - **Bar Scale**: 막대 높이 배율 조절

## 📄 라이선스

MIT License
