# GitHub Pages 배포 가이드

이 문서는 `etteuProfile.html`을 GitHub Pages에 배포하는 방법을 안내합니다.

## 1단계: Git 저장소 초기화

프로젝트 폴더에서 다음 명령어를 실행합니다:

```bash
# Git 저장소 초기화
git init

# 현재 파일들을 스테이징
git add etteuProfile.html profile-data.json script.js styles.css img/

# .gitignore 파일도 추가
git add .gitignore README.md

# 첫 커밋
git commit -m "Initial commit: Add profile page"
```

## 2단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인합니다.
2. 우측 상단의 **+** 버튼을 클릭하고 **New repository**를 선택합니다.
3. 저장소 이름을 입력합니다 (예: `my-profile`).
4. **Public** 또는 **Private**을 선택합니다.
5. **Initialize this repository with a README**는 체크하지 않습니다 (이미 로컬에 파일이 있으므로).
6. **Create repository**를 클릭합니다.

## 3단계: 로컬 저장소를 GitHub에 연결

GitHub에서 생성한 저장소의 URL을 복사한 후:

```bash
# 원격 저장소 추가 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 또는 SSH를 사용하는 경우
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 파일 푸시
git branch -M main
git push -u origin main
```

## 4단계: GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동합니다.
2. **Settings** 탭을 클릭합니다.
3. 왼쪽 메뉴에서 **Pages**를 선택합니다.
4. **Source** 섹션에서:
   - **Branch**를 `main` (또는 `master`)로 선택합니다.
   - **Folder**를 `/ (root)`로 선택합니다.
5. **Save**를 클릭합니다.

## 5단계: 사이트 접속

몇 분 후 다음 URL로 접속할 수 있습니다:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/etteuProfile.html
```

또는 `index.html`을 `etteuProfile.html`로 이름을 변경하거나, 저장소 설정에서 기본 페이지를 설정할 수 있습니다.

## 6단계: 기본 페이지 설정 (선택사항)

`etteuProfile.html`을 기본 페이지로 만들고 싶다면:

1. `etteuProfile.html`을 `index.html`로 복사하거나 이름을 변경합니다.
2. 변경사항을 커밋하고 푸시합니다.

또는 GitHub Pages 설정에서 기본 파일을 지정할 수 있습니다.

## 업데이트 방법

프로필을 업데이트하려면:

```bash
# 파일 수정 후
git add .
git commit -m "Update profile data"
git push
```

GitHub Pages는 자동으로 업데이트됩니다 (몇 분 소요될 수 있습니다).

## 커스텀 도메인 설정 (선택사항)

자신의 도메인을 사용하고 싶다면:

1. 저장소 루트에 `CNAME` 파일을 생성합니다.
2. 도메인 이름을 입력합니다 (예: `profile.example.com`).
3. DNS 설정에서 CNAME 레코드를 추가합니다.

## 문제 해결

### 페이지가 표시되지 않는 경우

1. GitHub Pages 설정에서 올바른 브랜치가 선택되었는지 확인합니다.
2. 파일 경로가 올바른지 확인합니다 (`etteuProfile.html`).
3. 몇 분 기다려봅니다 (배포에 시간이 걸릴 수 있습니다).

### 이미지가 표시되지 않는 경우

1. `img/` 폴더의 모든 이미지가 커밋되었는지 확인합니다.
2. 이미지 경로가 상대 경로로 되어 있는지 확인합니다.

### JSON 데이터가 로드되지 않는 경우

1. `profile-data.json` 파일이 올바른 JSON 형식인지 확인합니다.
2. 브라우저 콘솔에서 오류 메시지를 확인합니다.

