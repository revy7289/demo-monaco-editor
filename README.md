# Code Editor with Zip File Handling

(25.05.11)

## 요구사항 분석

---

![Image](https://github.com/user-attachments/assets/edac44cf-d3ef-47b9-a04c-bce66a9fe267)

### 디자인

- 디자인 기능 동작하는 한 자유롭게 구현
- 서비스 ui참고하여 레이아웃 큰 틀은 유지

### 기능

- 상단에서 ZIP파일을 업로드하여 프로젝트에서 사용할 수 있다.
- 업로드한 ZIP파일은 사이드바에서 파일 내부의 내용들이 tree 구조로 표현된다.
  - ZIP파일 파싱 및 이후 tree구조를 만드는 로직은 직접 작성하시기 바랍니다.
- 파일트리에서 파일을 클릭하면 tab에 추가되어야 한다.
  - 편집 가능한 text의 경우 Editor에 전달되어 수정할 수 있어야 한다.
  - Binary 파일 중 이미지는 화면에서 미리보기로 볼 수 있어야 한다.
- tab에 추가된 파일은 닫을 수 있어야 한다.
- 파일 변경이 있을 경우, 상단의 다운로드 버튼을 눌러 다운로드 할 수 있어야 한다.
- Monaco Editor를 사용하며, undo/redo가 가능해야 한다.

### 요구사항

- Monaco editor를 직접 사용한다.
- TypeScript를 사용한다.
- React Hook을 사용해 function Component를 구현한다.
- styled component, css module, emotion 등을 사용한다.
- 성능 최적화를 고려한다.
  - 웹 속도?
  - 불피요한 렌더?
  - 번들 사이즈?

# 개발 결과

---

![Image](https://github.com/user-attachments/assets/28706194-375f-47e7-9189-a096d2df0344)

- [x] 상단 ZIP파일 업로드
- [x] 업로드 파일 분석 ⇒ 사이드바에 트리구조
- [x] 파일트리에서 파일 선택 ⇒ tab에 추가
  - [x] 📄 editable할 경우 editor에 전달하여 편집가능
  - [x] 🖼️ image일 경우 editor끄고 `<image>`로 미리보기
- [x] tab 클릭시 tab close하며 editor 초기화
- [x] editor에서 파일을 변경하면 변경한 내용이 반영됨
- [x] 상단 re-zip버튼을 눌러 변경한 파일을 다운로드 할 수 있음
- [ ] Monaco Editor 키 바인딩 및 redo/undo
- [ ] optional 추가과제들..

## 사용 기술

---

- React + Vite  
  초기에는 Next.js로 프로젝트를 세팅하였으나, `monacoWorker` 설정 및 `instanceRef`를 세밀하게 제어하기 까다로운 이슈가 있었습니다. 이에 보다 자유로운 DOM 접근과 API 활용이 가능한 환경이 필요하다고 판단하여 React 기반의 SPA로 방향을 전환하였습니다.
- TypeScript  
  ZIP 파일 파싱과 동시에 트리 구조를 구성하도록 설계하였으며, 반환된 `zipEntries`는 통합된 타입으로 정의하여 전역에서 재사용 가능하게 하고, 타입 안정성과 예외 처리를 통해 에러 없이 동작하도록 구현하였습니다.
- module.css  
  소규모 컴포넌트를 app.tsx에서 결합하는 구조로 설계하였으며, 여러 css번들 및 트랜스파일링 없이 가장 순수하고 가볍게 사용할 수 있기 때문에 선택 하였습니다.
- Monaco Editor ( https://github.com/microsoft/monaco-editor )
- JSZip ( https://github.com/Stuk/jszip )  
  라이브러리 없이 ZIP 파일을 직접 파싱하는 과정을 시도하다가 방향을 전환하였습니다.
  `dirOffset`을 순회하며 파일 메타데이터를 분석하고 내부 콘텐츠에 접근하려 했으나, 실제 압축 해제를 위해서는 별도의 복잡한 알고리즘이 필요하다는 점을 확인하게 되었습니다.
  이는 프로젝트 범위에 비해 과도한 오버스펙이라 판단하여, 핵심 로직 구현에 집중할 수 있도록 라이브러리를 도입해 빠르게 마이그레이션을 완료하였습니다.

## 폴더 구조

---

```bash
src
├── main.tsx
├── App.tsx
├── monacoWorker.ts
│
├── components
│   ├── FileTree.tsx
│   ├── FileUploader.tsx
│   ├── MonacoEditor.tsx
│   └── Tab.tsx
├── features
│   ├── useFileTaps.ts
│   ├── useJSZip.ts
│   └── useUploadFile.ts
└── shared
    └── ITreeNode.ts
```

## 구현 전략

---

![Image](https://github.com/user-attachments/assets/791ca594-066e-41b9-a2b2-4b00437cf9f4)

View와 비즈니스 로직(feat)의 관심사를 명확히 분리하기 위해 `Container/Presenter` 패턴을 적용하였습니다.

Presenter는 각 섹션별 컴포넌트로 구성되어 UI 렌더링에 집중하며, Container는 Custom Hook을 통해 상태 관리와 비즈니스 로직을 담당함으로써 유지보수성과 재사용성을 높였습니다.

또한 설계 기반으로 섹션별 기능을 점진적으로 개발하였으며, 기능 단위의 모듈화를 구현하였습니다.

최종적으로 `App.tsx`는 컴포넌트 조합과 로직 전달(props)을 담당하는 구성 역할만 수행하도록 설계하였습니다.

## 구현 상세

---

### **Section 1. Monaco Editor**

---

처음에는 Next.js를 사용해 초기셋팅을 완료하고 editor설치와 컴포넌트 구현을 시도하였습니다.

Monaco Editor Github에서 샘플 코드 ( https://github.com/microsoft/monaco-editor/tree/main/samples )를 확인할 수 있었고, 이 중에서 **`browser-esm-webpack-typescript`** 샘플을 활용하여 빠르게 컴포넌트를 구성할 수 있었습니다.

하지만, ui는 표현되지만 정상적으로 기능하지 않아 조사해본 결과, 이 예제에서는 worker를 webpack 환경변수로 사용하기 때문에 next의 static module에 포함되지 않아 몇 개의 env 셋팅이 누락되는 것을 확인하였습니다.

따라서 더 빠른 개발과 적용을 위해 React + Vite로 프로젝트를 다시 셋팅하여 **`browser-esm-vite-react`** 샘플로 구성하여 빠르게 구현할 수 있었습니다.

**Sample code**

```jsx
const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);
	...
	<div className={styles.Editor} ref={monacoEl}></div>;
```

**Migration Code**

```jsx
const containerRef = useRef(null);
  const instanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  ...
instanceRef.current = monaco.editor.create(containerRef.current, { ... }
  ...
  <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>
```

기존의 **`browser-esm-vite-react`** 샘플코드는 state와 ref의 조합으로 editor Instance를 관리합니다. 이 코드로 진행할 경우, React Stract Mode에서 최초 Mount시 Instance가 생성되고, strinct를 위한 unmount후 2번째 mount에서 Instance가 다시 생성되는 이슈가 존재합니다.

따라서 2개의 ref를 활용하여 editor Instance를 관리하는 instanceRef, editor를 UI에 표현할 containerRef로 분할 관리하여 관심사를 분리하면서 editor가 두번 생성되는 이슈를 해결하였습니다.

### **Section 2. FileUploader**

---

**App.tsx**

```jsx
<div className="content_uploader" onClick={handleInputClick}>
  <FileUploader
    inputRef={inputRef}
    fileName={fileName}
    handleFileChange={handleFileChange}
  />
</div>
...
```

**FileUploader.tsx**

```jsx
...
return (
    <>
      <div>{fileName || "File Upload Handler"}</div>

      <input
        style={{ display: "none" }}
        type="file"
        accept=".zip"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </>
  );
```

**useUploadFile.ts**

```jsx
const { inputRef, fileName, fileTree, handleInputClick, handleFileChange } =
  useUploadFile();
```

App.tsx의 div el을 클릭하면 FileUploader.tsx 내부의 input을 Ref하여 접근하고,

onChange로 파일을 감지하게하여 업로드 기능을 구현하였습니다.

이러한 과정에서 Custom Hook을 사용하여 관심사를 명확하게 분리하였습니다.

### **Section 3. FileTree.tsx**

---

**fileTree return 예시**

```jsx
[
  📂 douleNested/                    // 첫 번째 폴더
    └── 📂 depth2/                   // 중첩된 폴더
        └── 📄 depth.html            // depth2 내 파일

  📄 Elice_CI.zip                    // ZIP 파일

  📂 nestedDir/                      // 두 번째 폴더
    └── 📄 test.js                   // nestedDir 내 파일

  📄 testDoc.pdf                     // PDF 파일
  📄 testImg.png                     // PNG 이미지 파일
  📄 testMark.md                     // Markdown 파일
  📄 testMemo.txt                    // 텍스트 파일
  📄 이력서_프론트엔드_이하성.pdf    // PDF 파일
  📄 포트폴리오_프론트엔드_이하성.pdf // PDF 파일
]
```

**renderTree 재귀함수**

```tsx
const renderTree = (node: ITreeNode) => {
    return (
      <li key={node.path}>
        <span
          style={{ whiteSpace: "nowrap" }}
          onClick={() => handleFileClick(node)}
        >
          {getFileIcon(node)} {node.name}
        </span>
        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTree(child))}</ul>
        )}
      </li>
    );
  };

  return <>{fileTree.map((node) => renderTree(node))}</>;
};
```

업로드한 ZIP파일을 JSZip으로 파싱하여 분석된 파일들을 예시와 같이 하나의 배열로 전달받을 수 있었습니다.

이 구조를 바탕으로 재귀적 함수를 구성하여 객체가 children을 포함하고 있다면 ul태그 내부에서 renderTree를 다시 호출하도록 순환하게 하여 중첩구조를 UI로도 표현하였습니다.

또한 함수를 순환하며, 보다 더 알아보기 쉽게 폴더의 경우 폴더 아이콘을, 파일의 경우 파일 아이콘을 부착하도록 하여 UX또한 신경써서 작업하였습니다.

### ZIP parse??

> 업로드된 ZIP파일을 파싱하는 로직을 직접 구현해보려고 하였으나, 처음 접해보는 압축 알고리즘을 다루는 것은 현실적인 무리가 있었습니다.

핵심이 되는 로직의 대부분은 GPT 코드를 가공한 것에 불과하고 구체적인 이해를 하고 있다고 생각하지 않습니다. 따라서 파싱하는 과정에 대한 구체적인 해설은 함구하겠습니다.

압축 해제와 내부 컨텐츠 접근에는 결과적으로 실패하였으나, 파일을 분석하고 트리 구조를 형성하는 과정과 압축된 해시 데이터에 접근하여 배열에 포함하는 것까지는 성공하였습니다.

이 코드를 기반으로 JSZip라이브러리를 사용하여 빠르게 마이그레이션과 재작업이 가능하였고 필요한 기능 구현을 수행하였습니다.

### Section 4. Tab.tsx

---

```jsx
const handleFileClick = (file: ITreeNode) => {
  if (file.type === "folder") return;
  if (file.isText === false && file.isImage === false)
    return alert("수정할 수 없는 파일입니다!");

  setOpenTabs((prev) => {
    const alreadyOpen = prev.find((tab) => tab.path === file.path);
    if (alreadyOpen) return prev;
    return [...prev, file];
  });

  setActiveTab(file);
};
```

파일 선택 시 폴더이거나 수정 불가능한 형식일 경우 예외 처리를 통해 편집을 제한하였습니다.

또한 이미 열린 파일인지 확인하여 중복 탭을 방지하고, 새로운 파일만 탭 배열에 추가하도록 구현하였습니다.

이러한 배열 상태는 Custom Hook 내부에 위치하므로, 해당 기능이 호출될 경우에만 렌더를 발동하며, return된 state값들을 UI에 props으로 직접 내려주어 연동되게 설계하였습니다.

즉, state가 변하면서 렌더가 촉발될 때 UI의 props 또한 변경되면서 렌더가 발동되지만, 서로 연동되면서 같은 시점에 렌더가 발동하므로 리액트 내부적인 평가에서 최종 반영된 데이터만으로 렌더를 수행하므로 불필요한 렌더를 최소화할 수 있었습니다.

```jsx
const handleTapClick = (selectedTab: ITreeNode) => {
    if (selectedTab.path === activeTab?.path) {
      // ✅ 중복 클릭하면 탭 닫기
      const newTabs = openTabs.filter((tab) => tab.path !== selectedTab.path);
      setOpenTabs(newTabs);
      setActiveTab(undefined);
    } else {
      // ✅ 다른 탭 클릭하면 activeTab만 변경
      setActiveTab(selectedTab);
    }
  };
  ...

  {activeTab?.content ? (
    <MonacoEditor
      key={activeTab.path}
      content={activeTab.content}
      setOpenTabs={setOpenTabs}
      activeTab={activeTab}
    />
  )
```

동일한 탭을 중복 클릭하면 해당 탭을 닫고 editor도 자동 종료되도록 `activeTab`을 `undefined`로 초기화하는 로직을 구현하였습니다. 이 과정에서 `openTabs` 배열에서 해당 항목을 제거하고, editor는 `activeTab`이 존재할 경우에만 조건부 렌더링되도록 하여 탭과 에디터의 상태를 자연스럽게 연동시켰습니다.

### Section 5. modify Editor contnet

---

```jsx
{activeTab?.content ? (
	<MonacoEditor
	key={activeTab.path}
	content={activeTab.content}
	setOpenTabs={setOpenTabs}
	activeTab={activeTab}
	/>
```

```jsx
const model = editor.getModel();
const changeListener = editor.onDidChangeModelContent(() => {
  const newValue = model?.getValue();
  if (newValue !== undefined) {
    setOpenTabs((prev) =>
      prev.map((tab) =>
        tab.path === activeTab.path ? { ...tab, content: newValue } : tab
      )
    );
  }
});
```

이전 다른 editor 라이브러리를 사용해 본 경험에서 setValue와 관련된 api가 있을 것이라 생각하여 공식문서를 찾아본 결과, Monaco의 경우 Model을 호출하고, changeListener를 부착하는 방식을 확인하였습니다.

위 코드를 통해 changeEvent를 연동하고, getValue로 기존 content를 가져오고 Entries를 map하여 각각의 content를 setState로 업데이트하여 변경된 값을 반영할 수 있었습니다.

state의 조건 분기에 따라 조건부 렌더링을 처리하고 있음에도, 탭을 전환하거나 종료해도 MonacoEditor 인스턴스가 종료되지 않는 이슈가 발생했습니다.

이 문제는 에디터가 ref를 통해 인스턴스로 관리되는 구조에서, 고유한 key가 할당되지 않아 동일한 DOM 구조로 인식되어 React의 리렌더링이 제대로 이루어지지 않았기 때문입니다.  
즉, 렌더링이 발생해도 Virtual DOM 상에서 변화로 인식되지 않아 diffing이 일어나지 않았습니다.

이를 해결하기 위해 현재 선택된 탭의 path 값을 key로 지정하여 각 에디터 인스턴스가 고유한 식별값을 갖도록 했고, 그 결과 정상적으로 diffing이 이루어져 에디터가 올바르게 마운트 및 언마운트되도록 개선할 수 있었습니다.
