// 편집 화면 로직
let editData = null;

// 데이터 로드
function loadEditData() {
    const saved = localStorage.getItem('profileData');
    if (saved) {
        try {
            editData = JSON.parse(saved);
        } catch (e) {
            console.error('편집 화면: 데이터 파싱 오류:', e);
            editData = ProfileData.getDefaultData();
        }
    } else {
        editData = ProfileData.getDefaultData();
    }
    renderEditForm();
}

// 편집 폼 렌더링
function renderEditForm() {
    // 프로필 정보
    document.getElementById('editProfileImage').value = editData.profile.image || '';
    document.getElementById('editProfileName').value = editData.profile.name || '';
    document.getElementById('editProfileEmail').value = editData.profile.email || '';
    document.getElementById('editProfilePhone').value = editData.profile.phone || '';
    document.getElementById('editProfileLine').value = editData.profile.links.line || '';
    document.getElementById('editProfileGithub').value = editData.profile.links.github || '';
    document.getElementById('editProfileDiscord').value = editData.profile.links.discord || '';
    document.getElementById('editProfileYoutube').value = editData.profile.links.youtube || '';
    document.getElementById('editProfileFacebook').value = editData.profile.links.facebook || '';
    document.getElementById('editProfileInstagram').value = editData.profile.links.instagram || '';
    document.getElementById('editProfileEnabled').checked = editData.profile.enabled !== false;

    // INTRODUCE
    const introduceEditor = document.getElementById('editIntroduce');
    if (introduceEditor) {
        introduceEditor.innerHTML = editData.introduce.content || '';
    }
    document.getElementById('editIntroduceEnabled').checked = editData.enabled.introduce !== false;

    // 섹션 순서 설정
    const sectionOrder = editData.sectionOrder || {
        experience: 1,
        project: 2,
        opensource: 3,
        education: 4,
        etc: 5,
        article: 6,
        coverLetter: 7,
        portfolio: 8
    };
    document.getElementById('sectionOrderExperience').value = sectionOrder.experience || 1;
    document.getElementById('sectionOrderProject').value = sectionOrder.project || 2;
    document.getElementById('sectionOrderOpensource').value = sectionOrder.opensource || 3;
    document.getElementById('sectionOrderEducation').value = sectionOrder.education || 4;
    document.getElementById('sectionOrderEtc').value = sectionOrder.etc || 5;
    document.getElementById('sectionOrderArticle').value = sectionOrder.article || 6;
    document.getElementById('sectionOrderCoverLetter').value = sectionOrder.coverLetter || 7;
    document.getElementById('sectionOrderPortfolio').value = sectionOrder.portfolio || 8;

    // SKILL
    renderSkillEdit();

    // EXPERIENCE
    renderExperienceEdit();

    // PROJECT
    renderProjectEdit();

    // OPEN SOURCE
    renderOpensourceEdit();

    // EDUCATION
    renderEducationEdit();

    // ETC
    renderEtcEdit();

    // ARTICLE
    renderArticleEdit();

    // 자기소개서
    renderCoverLetterEdit();

    // 포트폴리오
    renderPortfolioEdit();

    // 섹션 활성화 상태 설정
    document.getElementById('editSkillEnabled').checked = editData.enabled.skill !== false;
    document.getElementById('editExperienceEnabled').checked = editData.enabled.experience !== false;
    document.getElementById('editProjectEnabled').checked = editData.enabled.project !== false;
    document.getElementById('editOpensourceEnabled').checked = editData.enabled.opensource !== false;
    document.getElementById('editEducationEnabled').checked = editData.enabled.education !== false;
    document.getElementById('editEtcEnabled').checked = editData.enabled.etc !== false;
    document.getElementById('editArticleEnabled').checked = editData.enabled.article !== false;
    if (document.getElementById('editCoverLetterEnabled')) {
        document.getElementById('editCoverLetterEnabled').checked = editData.enabled.coverLetter !== false;
    }
    if (document.getElementById('editPortfolioEnabled')) {
        document.getElementById('editPortfolioEnabled').checked = editData.enabled.portfolio !== false;
    }
}

// SKILL 편집 렌더링
function renderSkillEdit() {
    const container = document.getElementById('skillEditContainer');
    container.innerHTML = '';
    
    editData.skills.forEach((skill, index) => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-category-edit';
        skillDiv.innerHTML = `
            <div class="skill-category-edit-header">
                <input type="text" class="skill-category-name" value="${skill.category}" data-index="${index}">
                <button type="button" class="delete-btn" onclick="deleteSkillCategory(${index})">삭제</button>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" class="skill-enabled" ${skill.enabled !== false ? 'checked' : ''} data-index="${index}">
                    활성화
                </label>
            </div>
            <div class="skill-items-edit" id="skillItems${index}">
                ${skill.items.map((item, itemIndex) => `
                    <span class="skill-tag">
                        ${item}
                        <span class="skill-tag-remove" onclick="removeSkillItem(${index}, ${itemIndex})">×</span>
                    </span>
                `).join('')}
            </div>
            <div class="skill-input-container">
                <input type="text" class="new-skill-input" placeholder="새 스킬 추가" data-index="${index}">
                <button type="button" class="add-skill-btn" onclick="addSkillItem(${index})">추가</button>
            </div>
        `;
        container.appendChild(skillDiv);
    });
}

// EXPERIENCE 입력 필드 값 저장
function saveExperienceInputs() {
    document.querySelectorAll('.experience-start-date').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].startDate = input.value;
        }
    });
    document.querySelectorAll('.experience-end-date').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].endDate = input.value;
        }
    });
    document.querySelectorAll('.experience-is-current').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].isCurrent = checkbox.checked;
        }
    });
    document.querySelectorAll('.experience-employment-type').forEach(select => {
        const index = parseInt(select.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].employmentType = select.value;
        }
    });
    document.querySelectorAll('.experience-company').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].company = input.value;
        }
    });
    document.querySelectorAll('.experience-role').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].role = input.value;
        }
    });
    document.querySelectorAll('.experience-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].description = textarea.value;
        }
    });
    document.querySelectorAll('.experience-skills').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.experiences[index]) {
            const skillsStr = input.value;
            editData.experiences[index].skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s) : [];
        }
    });
    document.querySelectorAll('.item-enabled[data-type="experience"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.experiences[index]) {
            editData.experiences[index].enabled = checkbox.checked;
        }
    });
}

// EXPERIENCE 편집 렌더링
function renderExperienceEdit(skipSave) {
    if (!skipSave) {
        saveExperienceInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    const container = document.getElementById('experienceEditContainer');
    container.innerHTML = '';
    
    editData.experiences.forEach((exp, index) => {
        const expDiv = createExperienceEditItem(exp, index);
        container.appendChild(expDiv);
    });
}

function createExperienceEditItem(exp, index) {
    const startDate = exp.startDate || '';
    const endDate = exp.endDate || '';
    const isCurrent = exp.isCurrent || false;
    const employmentType = exp.employmentType || '정규직';
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${exp.company || '새 경력'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveExperience(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveExperience(${index}, 'down')" title="아래로" ${index === editData.experiences.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteExperience(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${exp.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="experience">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>입사일:</label>
            <input type="date" class="experience-start-date" value="${startDate}" data-index="${index}" onchange="calculateDuration(${index})">
        </div>
        <div class="form-group">
            <label>퇴사일:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="date" class="experience-end-date" value="${endDate}" data-index="${index}" onchange="calculateDuration(${index})" ${isCurrent ? 'disabled' : ''} style="flex: 1;">
                <label style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
                    <input type="checkbox" class="experience-is-current" ${isCurrent ? 'checked' : ''} data-index="${index}" onchange="toggleCurrentEmployment(${index})">
                    재직중
                </label>
            </div>
        </div>
        <div class="form-group">
            <label>재직 기간 (자동 계산):</label>
            <input type="text" class="experience-duration" value="${exp.duration || ''}" data-index="${index}" readonly style="background-color: #f0f0f0;">
        </div>
        <div class="form-group">
            <label>고용형태:</label>
            <select class="experience-employment-type" data-index="${index}">
                <option value="정규직" ${employmentType === '정규직' ? 'selected' : ''}>정규직</option>
                <option value="계약직" ${employmentType === '계약직' ? 'selected' : ''}>계약직</option>
                <option value="프리랜서" ${employmentType === '프리랜서' ? 'selected' : ''}>프리랜서</option>
                <option value="기타" ${employmentType === '기타' ? 'selected' : ''}>기타</option>
            </select>
        </div>
        <div class="form-group">
            <label>회사명:</label>
            <input type="text" class="experience-company" value="${exp.company || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>역할:</label>
            <input type="text" class="experience-role" value="${exp.role || ''}" data-index="${index}" placeholder="예: 백엔드 개발자">
        </div>
        <div class="form-group">
            <label>설명:</label>
            <textarea class="experience-description-textarea experience-description" data-index="${index}" rows="6">${exp.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>스킬 키워드 (쉼표로 구분):</label>
            <input type="text" class="experience-skills" value="${(exp.skills || []).join(', ')}" data-index="${index}" placeholder="예: Kotlin, Java, Spring Boot">
        </div>
    `;
    return div;
}

// PROJECT 입력 필드 값 저장
function saveProjectInputs() {
    document.querySelectorAll('.project-name').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.projects[index]) {
            editData.projects[index].name = input.value;
        }
    });
    document.querySelectorAll('.project-client').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.projects[index]) {
            editData.projects[index].client = input.value;
        }
    });
    document.querySelectorAll('.project-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.projects[index]) {
            editData.projects[index].period = input.value;
        }
    });
    document.querySelectorAll('.project-description').forEach(editor => {
        const index = parseInt(editor.dataset.index);
        if (editData.projects[index]) {
            // contenteditable의 DOM 구조를 직접 순회하여 텍스트와 줄바꿈 추출
            const clone = editor.cloneNode(true);
            let result = '';
            let hasLink = false;
            
            // 텍스트와 링크 추출 헬퍼 함수
            const extractTextAndLinks = (element) => {
                let content = '';
                Array.from(element.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        content += child.textContent;
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const childTag = child.tagName.toLowerCase();
                        if (childTag === 'a') {
                            hasLink = true;
                            content += child.outerHTML;
                        } else if (childTag === 'br') {
                            content += '<br>';
                        } else {
                            content += extractTextAndLinks(child);
                        }
                    }
                });
                return content;
            };
            
            // 모든 자식 노드 순회
            const allElements = Array.from(clone.childNodes);
            
            allElements.forEach((node, idx) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // 텍스트 노드
                    const text = node.textContent;
                    if (text.trim()) {
                        result += text;
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    
                    // 링크 태그 확인
                    if (tagName === 'a') {
                        hasLink = true;
                        result += node.outerHTML;
                    } else if (tagName === 'div' || tagName === 'p') {
                        // 블록 태그: 내용 추출 후 줄바꿈 추가
                        const blockContent = extractTextAndLinks(node);
                        if (blockContent.trim()) {
                            // 이전에 내용이 있었다면 줄바꿈 추가
                            if (result && result.trim() && !result.endsWith('<br>') && !result.endsWith('<br/>')) {
                                result += '<br>';
                            }
                            result += blockContent;
                            // 블록 종료 후 줄바꿈 추가
                            result += '<br>';
                        } else {
                            // 빈 블록은 줄바꿈만 추가
                            if (result && result.trim() && !result.endsWith('<br>') && !result.endsWith('<br/>')) {
                                result += '<br>';
                            }
                        }
                    } else if (tagName === 'br') {
                        result += '<br>';
                    } else {
                        // 다른 태그는 내용만 추출
                        result += extractTextAndLinks(node);
                    }
                }
            });
            
            // 연속된 <br> 정리 (최대 2개까지만)
            result = result.replace(/(<br\s*\/?>){3,}/gi, '<br><br>');
            
            // 앞뒤 <br> 정리
            result = result.replace(/^(<br\s*\/?>)+/i, '');
            result = result.replace(/(<br\s*\/?>)+$/i, '');
            
            // 앞뒤 공백 제거
            result = result.trim();
            
            // 링크가 있거나 HTML 태그가 있으면 HTML로 저장, 없으면 텍스트로 저장
            if (hasLink || result.includes('<')) {
                editData.projects[index].description = result;
            } else {
                // 텍스트만 있는 경우
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = result;
                const text = tempDiv.textContent || tempDiv.innerText || '';
                editData.projects[index].description = text.trim();
            }
        }
    });
    document.querySelectorAll('.project-skills').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.projects[index]) {
            const skillsStr = input.value;
            editData.projects[index].skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s) : [];
        }
    });
    document.querySelectorAll('.item-enabled[data-type="project"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.projects[index]) {
            editData.projects[index].enabled = checkbox.checked;
        }
    });
    // 링크 저장
    document.querySelectorAll('.project-links-edit .link-item').forEach(linkItem => {
        const projectIndex = parseInt(linkItem.querySelector('.link-label')?.dataset.index);
        const linkIndex = parseInt(linkItem.querySelector('.link-label')?.dataset.linkIndex);
        if (projectIndex !== undefined && linkIndex !== undefined && editData.projects[projectIndex]) {
            const label = linkItem.querySelector('.link-label')?.value || '';
            const url = linkItem.querySelector('.link-url')?.value || '';
            if (!editData.projects[projectIndex].links) {
                editData.projects[projectIndex].links = [];
            }
            if (editData.projects[projectIndex].links[linkIndex]) {
                editData.projects[projectIndex].links[linkIndex] = { label, url };
            }
        }
    });
}

// PROJECT 편집 렌더링
function renderProjectEdit(skipSave) {
    if (!skipSave) {
        saveProjectInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    const container = document.getElementById('projectEditContainer');
    if (!container) {
        console.error('renderProjectEdit: projectEditContainer 요소를 찾을 수 없습니다.');
        return;
    }
    container.innerHTML = '';
    
    if (!editData || !editData.projects || !Array.isArray(editData.projects)) {
        console.error('renderProjectEdit: 프로젝트 데이터가 유효하지 않습니다.', editData);
        return;
    }
    
    editData.projects.forEach((proj, index) => {
        const projDiv = createProjectEditItem(proj, index);
        container.appendChild(projDiv);
    });
}

function createProjectEditItem(proj, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${proj.name || '새 프로젝트'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveProject(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveProject(${index}, 'down')" title="아래로" ${index === editData.projects.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteProject(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${proj.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="project">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>프로젝트명:</label>
            <input type="text" class="project-name" value="${proj.name || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>고객사 (선택사항):</label>
            <input type="text" class="project-client" value="${proj.client || ''}" data-index="${index}" placeholder="예: 삼성전자, SK하이닉스">
        </div>
        <div class="form-group">
            <label>기간:</label>
            <input type="text" class="project-period" value="${proj.period || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>설명:</label>
            <div class="rich-text-editor project-editor">
                <div class="editor-toolbar">
                    <button type="button" class="toolbar-btn" onclick="formatProjectText(${index}, 'bold')" title="굵게">B</button>
                    <button type="button" class="toolbar-btn" onclick="formatProjectText(${index}, 'italic')" title="기울임">I</button>
                    <button type="button" class="toolbar-btn" onclick="formatProjectText(${index}, 'underline')" title="밑줄">U</button>
                    <button type="button" class="toolbar-btn" onclick="insertProjectLink(${index})" title="링크 삽입">🔗</button>
                </div>
                <div class="project-description" contenteditable="true" data-index="${index}" style="min-height: 150px; border: 1px solid #ddd; padding: 10px; border-radius: 4px; outline: none; white-space: pre-wrap;">${formatProjectDescriptionForEdit(proj.description || '')}</div>
            </div>
        </div>
        <div class="form-group">
            <label>기술 스택 (쉼표로 구분):</label>
            <input type="text" class="project-skills" value="${(proj.skills || []).join(', ')}" data-index="${index}" placeholder="예: Spring Boot, React.js, MySQL">
        </div>
        <div class="form-group">
            <label>링크:</label>
            <div class="project-links-edit" id="projectLinks${index}">
                ${(proj.links || []).map((link, linkIndex) => `
                    <div class="link-item">
                        <input type="text" class="link-label" value="${link.label || ''}" placeholder="링크 라벨" data-index="${index}" data-link-index="${linkIndex}">
                        <input type="url" class="link-url" value="${link.url || ''}" placeholder="URL" data-index="${index}" data-link-index="${linkIndex}">
                        <button type="button" class="delete-btn" onclick="removeProjectLink(${index}, ${linkIndex})">삭제</button>
                    </div>
                `).join('')}
            </div>
            <button type="button" class="add-link-btn" onclick="addProjectLink(${index})">+ 링크 추가</button>
        </div>
    `;
    return div;
}

// OPEN SOURCE 입력 필드 값 저장
function saveOpensourceInputs() {
    document.querySelectorAll('.opensource-name').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.opensources[index]) {
            editData.opensources[index].name = input.value;
        }
    });
    document.querySelectorAll('.opensource-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        if (editData.opensources[index]) {
            editData.opensources[index].description = textarea.value;
        }
    });
    document.querySelectorAll('.item-enabled[data-type="opensource"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.opensources[index]) {
            editData.opensources[index].enabled = checkbox.checked;
        }
    });
    // 링크 저장
    document.querySelectorAll('.opensource-links-edit .link-item').forEach(linkItem => {
        const osIndex = parseInt(linkItem.querySelector('.link-label')?.dataset.index);
        const linkIndex = parseInt(linkItem.querySelector('.link-label')?.dataset.linkIndex);
        if (osIndex !== undefined && linkIndex !== undefined && editData.opensources[osIndex]) {
            const label = linkItem.querySelector('.link-label')?.value || '';
            const url = linkItem.querySelector('.link-url')?.value || '';
            if (!editData.opensources[osIndex].links) {
                editData.opensources[osIndex].links = [];
            }
            if (editData.opensources[osIndex].links[linkIndex]) {
                editData.opensources[osIndex].links[linkIndex] = { label, url };
            }
        }
    });
}

// OPEN SOURCE 편집 렌더링
function renderOpensourceEdit(skipSave) {
    if (!skipSave) {
        saveOpensourceInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    const container = document.getElementById('opensourceEditContainer');
    container.innerHTML = '';
    
    editData.opensources.forEach((os, index) => {
        const osDiv = createOpensourceEditItem(os, index);
        container.appendChild(osDiv);
    });
}

function createOpensourceEditItem(os, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${os.name || '새 오픈소스'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveOpensource(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveOpensource(${index}, 'down')" title="아래로" ${index === editData.opensources.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteOpensource(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${os.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="opensource">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>이름:</label>
            <input type="text" class="opensource-name" value="${os.name || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>설명:</label>
            <textarea class="opensource-description" data-index="${index}" rows="6">${os.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>링크:</label>
            <div class="opensource-links-edit" id="opensourceLinks${index}">
                ${(os.links || []).map((link, linkIndex) => `
                    <div class="link-item">
                        <input type="text" class="link-label" value="${link.label || ''}" placeholder="링크 라벨" data-index="${index}" data-link-index="${linkIndex}">
                        <input type="url" class="link-url" value="${link.url || ''}" placeholder="URL" data-index="${index}" data-link-index="${linkIndex}">
                        <button type="button" class="delete-btn" onclick="removeOpensourceLink(${index}, ${linkIndex})">삭제</button>
                    </div>
                `).join('')}
            </div>
            <button type="button" class="add-link-btn" onclick="addOpensourceLink(${index})">+ 링크 추가</button>
        </div>
    `;
    return div;
}

// EDUCATION 입력 필드 값 저장
function saveEducationInputs() {
    document.querySelectorAll('.education-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.educations[index]) {
            editData.educations[index].period = input.value;
        }
    });
    document.querySelectorAll('.education-school').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.educations[index]) {
            editData.educations[index].school = input.value;
        }
    });
    document.querySelectorAll('.education-major').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.educations[index]) {
            editData.educations[index].major = input.value;
        }
    });
    document.querySelectorAll('.item-enabled[data-type="education"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.educations[index]) {
            editData.educations[index].enabled = checkbox.checked;
        }
    });
}

// EDUCATION 편집 렌더링
function renderEducationEdit(skipSave) {
    if (!skipSave) {
        saveEducationInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    const container = document.getElementById('educationEditContainer');
    container.innerHTML = '';
    
    editData.educations.forEach((edu, index) => {
        const eduDiv = createEducationEditItem(edu, index);
        container.appendChild(eduDiv);
    });
}

function createEducationEditItem(edu, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${edu.school || '새 학력'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveEducation(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveEducation(${index}, 'down')" title="아래로" ${index === editData.educations.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteEducation(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${edu.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="education">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>기간:</label>
            <input type="text" class="education-period" value="${edu.period || ''}" data-index="${index}" placeholder="예: 2010. 03 ~ 2016. 08">
        </div>
        <div class="form-group">
            <label>학교명:</label>
            <input type="text" class="education-school" value="${edu.school || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>전공:</label>
            <input type="text" class="education-major" value="${edu.major || ''}" data-index="${index}" placeholder="예: 컴퓨터공학 / 정보시스템공학 복수 전공 학사 졸업">
        </div>
    `;
    return div;
}

// ETC 입력 필드 값 저장
function saveEtcInputs() {
    document.querySelectorAll('.etc-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.etcs[index]) {
            editData.etcs[index].period = input.value;
        }
    });
    document.querySelectorAll('.etc-title').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.etcs[index]) {
            editData.etcs[index].title = input.value;
        }
    });
    document.querySelectorAll('.etc-role').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.etcs[index]) {
            editData.etcs[index].role = input.value;
        }
    });
    document.querySelectorAll('.etc-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        if (editData.etcs[index]) {
            editData.etcs[index].description = textarea.value;
        }
    });
    document.querySelectorAll('.item-enabled[data-type="etc"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.etcs[index]) {
            editData.etcs[index].enabled = checkbox.checked;
        }
    });
}

// ETC 편집 렌더링
function renderEtcEdit(skipSave) {
    if (!skipSave) {
        saveEtcInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    const container = document.getElementById('etcEditContainer');
    container.innerHTML = '';
    
    editData.etcs.forEach((etc, index) => {
        const etcDiv = createEtcEditItem(etc, index);
        container.appendChild(etcDiv);
    });
}

function createEtcEditItem(etc, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${etc.title || '새 항목'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveEtc(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveEtc(${index}, 'down')" title="아래로" ${index === editData.etcs.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteEtc(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${etc.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="etc">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>기간:</label>
            <input type="text" class="etc-period" value="${etc.period || ''}" data-index="${index}" placeholder="예: 2025. 09 ~ 2025. 12">
        </div>
        <div class="form-group">
            <label>제목:</label>
            <input type="text" class="etc-title" value="${etc.title || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>역할:</label>
            <input type="text" class="etc-role" value="${etc.role || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>설명:</label>
            <textarea class="etc-description" data-index="${index}" rows="4">${etc.description || ''}</textarea>
        </div>
    `;
    return div;
}

// ARTICLE 입력 필드 값 저장
function saveArticleInputs() {
    document.querySelectorAll('.article-title').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.articles[index]) {
            editData.articles[index].title = input.value;
        }
    });
    document.querySelectorAll('.article-url').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.articles[index]) {
            editData.articles[index].url = input.value;
        }
    });
    document.querySelectorAll('.item-enabled[data-type="article"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.articles[index]) {
            editData.articles[index].enabled = checkbox.checked;
        }
    });
}

// ARTICLE 편집 렌더링
function renderArticleEdit(skipSave) {
    if (!skipSave) {
        saveArticleInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    const container = document.getElementById('articleEditContainer');
    container.innerHTML = '';
    
    editData.articles.forEach((article, index) => {
        const articleDiv = createArticleEditItem(article, index);
        container.appendChild(articleDiv);
    });
}

function createArticleEditItem(article, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${article.title || '새 아티클'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveArticle(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveArticle(${index}, 'down')" title="아래로" ${index === editData.articles.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteArticle(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${article.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="article">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>제목:</label>
            <input type="text" class="article-title" value="${article.title || ''}" data-index="${index}">
        </div>
        <div class="form-group">
            <label>URL:</label>
            <input type="url" class="article-url" value="${article.url || ''}" data-index="${index}">
        </div>
    `;
    return div;
}

// SKILL 관련 함수들
function addSkillCategory() {
    editData.skills.push({
        category: 'New Category',
        items: [],
        enabled: true
    });
    renderSkillEdit();
}

function deleteSkillCategory(index) {
    editData.skills.splice(index, 1);
    renderSkillEdit();
}

function addSkillItem(categoryIndex) {
    const input = document.querySelector(`.new-skill-input[data-index="${categoryIndex}"]`);
    const value = input.value.trim();
    if (value) {
        editData.skills[categoryIndex].items.push(value);
        input.value = '';
        renderSkillEdit();
    }
}

function removeSkillItem(categoryIndex, itemIndex) {
    editData.skills[categoryIndex].items.splice(itemIndex, 1);
    renderSkillEdit();
}

// EXPERIENCE 관련 함수들
function addExperience() {
    editData.experiences.push({
        startDate: '',
        endDate: '',
        isCurrent: false,
        employmentType: '정규직',
        period: '',
        company: '',
        duration: '',
        role: '',
        description: '',
        skills: [],
        enabled: true
    });
    renderExperienceEdit();
}

function calculateDuration(index) {
    const startDateInput = document.querySelector(`.experience-start-date[data-index="${index}"]`);
    const endDateInput = document.querySelector(`.experience-end-date[data-index="${index}"]`);
    const isCurrentCheckbox = document.querySelector(`.experience-is-current[data-index="${index}"]`);
    const durationInput = document.querySelector(`.experience-duration[data-index="${index}"]`);
    
    const startDate = startDateInput.value;
    const isCurrent = isCurrentCheckbox.checked;
    const endDate = isCurrent ? new Date().toISOString().split('T')[0] : endDateInput.value;
    
    if (!startDate || !endDate) {
        durationInput.value = '';
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
        durationInput.value = '날짜 오류';
        return;
    }
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // 일자도 고려
    if (end.getDate() < start.getDate()) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }
    
    let durationText = '';
    if (years > 0) {
        durationText += `${years}년 `;
    }
    if (months > 0) {
        durationText += `${months}개월`;
    }
    if (years === 0 && months === 0) {
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        durationText = `${days}일`;
    }
    
    durationInput.value = durationText.trim();
    
    // period 필드도 업데이트
    const periodInput = document.querySelector(`.experience-period[data-index="${index}"]`);
    if (periodInput) {
        const startFormatted = formatDateForDisplay(startDate);
        const endFormatted = isCurrent ? '현재' : formatDateForDisplay(endDate);
        periodInput.value = `${startFormatted} ~ ${endFormatted}`;
    }
}

function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}. ${month}`;
}

function toggleCurrentEmployment(index) {
    const checkbox = document.querySelector(`.experience-is-current[data-index="${index}"]`);
    const endDateInput = document.querySelector(`.experience-end-date[data-index="${index}"]`);
    
    if (checkbox.checked) {
        endDateInput.disabled = true;
        endDateInput.value = '';
    } else {
        endDateInput.disabled = false;
    }
    calculateDuration(index);
}

function moveExperience(index, direction) {
    console.log('moveExperience called', index, direction); // 디버깅용
    saveExperienceInputs(); // 먼저 현재 입력 값 저장
    if (direction === 'up' && index > 0) {
        const temp = editData.experiences[index - 1];
        editData.experiences[index - 1] = editData.experiences[index];
        editData.experiences[index] = temp;
        renderExperienceEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.experiences.length - 1) {
        const temp = editData.experiences[index];
        editData.experiences[index] = editData.experiences[index + 1];
        editData.experiences[index + 1] = temp;
        renderExperienceEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteExperience(index) {
    editData.experiences.splice(index, 1);
    renderExperienceEdit();
}

// PROJECT 관련 함수들
function addProject() {
    editData.projects.push({
        name: '',
        period: '',
        description: '',
        skills: [],
        links: [],
        enabled: true
    });
    renderProjectEdit();
}

function moveProject(index, direction) {
    console.log('moveProject called', index, direction, editData.projects.length); // 디버깅용
    saveProjectInputs(); // 먼저 현재 입력 값 저장
    if (direction === 'up' && index > 0) {
        const temp = editData.projects[index - 1];
        editData.projects[index - 1] = editData.projects[index];
        editData.projects[index] = temp;
        renderProjectEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.projects.length - 1) {
        const temp = editData.projects[index];
        editData.projects[index] = editData.projects[index + 1];
        editData.projects[index + 1] = temp;
        renderProjectEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteProject(index) {
    editData.projects.splice(index, 1);
    renderProjectEdit();
}

function addProjectLink(projectIndex) {
    if (!editData.projects[projectIndex].links) {
        editData.projects[projectIndex].links = [];
    }
    editData.projects[projectIndex].links.push({ label: '', url: '' });
    renderProjectEdit();
}

function removeProjectLink(projectIndex, linkIndex) {
    editData.projects[projectIndex].links.splice(linkIndex, 1);
    renderProjectEdit();
}

// OPEN SOURCE 관련 함수들
function addOpensource() {
    editData.opensources.push({
        name: '',
        description: '',
        links: [],
        enabled: true
    });
    renderOpensourceEdit();
}

function moveOpensource(index, direction) {
    console.log('moveOpensource called', index, direction); // 디버깅용
    saveOpensourceInputs(); // 먼저 현재 입력 값 저장
    if (direction === 'up' && index > 0) {
        const temp = editData.opensources[index - 1];
        editData.opensources[index - 1] = editData.opensources[index];
        editData.opensources[index] = temp;
        renderOpensourceEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.opensources.length - 1) {
        const temp = editData.opensources[index];
        editData.opensources[index] = editData.opensources[index + 1];
        editData.opensources[index + 1] = temp;
        renderOpensourceEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteOpensource(index) {
    editData.opensources.splice(index, 1);
    renderOpensourceEdit();
}

function addOpensourceLink(osIndex) {
    if (!editData.opensources[osIndex].links) {
        editData.opensources[osIndex].links = [];
    }
    editData.opensources[osIndex].links.push({ label: '', url: '' });
    renderOpensourceEdit();
}

function removeOpensourceLink(osIndex, linkIndex) {
    editData.opensources[osIndex].links.splice(linkIndex, 1);
    renderOpensourceEdit();
}

// EDUCATION 관련 함수들
function addEducation() {
    editData.educations.push({
        period: '',
        school: '',
        major: '',
        enabled: true
    });
    renderEducationEdit();
}

function moveEducation(index, direction) {
    console.log('moveEducation called', index, direction); // 디버깅용
    saveEducationInputs(); // 먼저 현재 입력 값 저장
    if (direction === 'up' && index > 0) {
        const temp = editData.educations[index - 1];
        editData.educations[index - 1] = editData.educations[index];
        editData.educations[index] = temp;
        renderEducationEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.educations.length - 1) {
        const temp = editData.educations[index];
        editData.educations[index] = editData.educations[index + 1];
        editData.educations[index + 1] = temp;
        renderEducationEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteEducation(index) {
    editData.educations.splice(index, 1);
    renderEducationEdit();
}

// ETC 관련 함수들
function addEtc() {
    editData.etcs.push({
        period: '',
        title: '',
        role: '',
        description: '',
        enabled: true
    });
    renderEtcEdit();
}

function moveEtc(index, direction) {
    console.log('moveEtc called', index, direction); // 디버깅용
    saveEtcInputs(); // 먼저 현재 입력 값 저장
    if (direction === 'up' && index > 0) {
        const temp = editData.etcs[index - 1];
        editData.etcs[index - 1] = editData.etcs[index];
        editData.etcs[index] = temp;
        renderEtcEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.etcs.length - 1) {
        const temp = editData.etcs[index];
        editData.etcs[index] = editData.etcs[index + 1];
        editData.etcs[index + 1] = temp;
        renderEtcEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteEtc(index) {
    editData.etcs.splice(index, 1);
    renderEtcEdit();
}

// ARTICLE 관련 함수들
function addArticle() {
    editData.articles.push({
        title: '',
        url: '',
        enabled: true
    });
    renderArticleEdit();
}

function moveArticle(index, direction) {
    console.log('moveArticle called', index, direction); // 디버깅용
    saveArticleInputs(); // 먼저 현재 입력 값 저장
    if (direction === 'up' && index > 0) {
        const temp = editData.articles[index - 1];
        editData.articles[index - 1] = editData.articles[index];
        editData.articles[index] = temp;
        renderArticleEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.articles.length - 1) {
        const temp = editData.articles[index];
        editData.articles[index] = editData.articles[index + 1];
        editData.articles[index + 1] = temp;
        renderArticleEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteArticle(index) {
    editData.articles.splice(index, 1);
    renderArticleEdit();
}

// 자기소개서 관련 함수들
function addCoverLetter() {
    saveCoverLetterInputs(); // 먼저 현재 입력 값 저장
    if (!editData.coverLetters) {
        editData.coverLetters = [];
    }
    editData.coverLetters.push({
        title: '',
        content: '',
        company: '',
        enabled: true
    });
    renderCoverLetterEdit();
}

function renderCoverLetterEdit(skipSave) {
    if (!skipSave) {
        saveCoverLetterInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    if (!editData.coverLetters) {
        editData.coverLetters = [];
    }
    const container = document.getElementById('coverLetterEditContainer');
    container.innerHTML = '';
    
    editData.coverLetters.forEach((letter, index) => {
        const letterDiv = createCoverLetterEditItem(letter, index);
        container.appendChild(letterDiv);
    });
}

function createCoverLetterEditItem(letter, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${letter.title || '새 자기소개서'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="moveCoverLetter(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="moveCoverLetter(${index}, 'down')" title="아래로" ${index === (editData.coverLetters.length - 1) ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deleteCoverLetter(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${letter.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="coverLetter">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>제목:</label>
            <input type="text" class="cover-letter-title" value="${letter.title || ''}" data-index="${index}" placeholder="예: 삼성전자 지원 자기소개서">
        </div>
        <div class="form-group">
            <label>소문구 (선택사항):</label>
            <input type="text" class="cover-letter-company" value="${letter.company || ''}" data-index="${index}" placeholder="예: 새로운 도전을 향해">
        </div>
        <div class="form-group">
            <label>내용:</label>
            <textarea class="cover-letter-content" data-index="${index}" rows="10" placeholder="자기소개서 내용을 입력하세요">${letter.content || ''}</textarea>
        </div>
    `;
    return div;
}

function saveCoverLetterInputs() {
    if (!editData.coverLetters) return;
    document.querySelectorAll('.cover-letter-title').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.coverLetters[index]) {
            editData.coverLetters[index].title = input.value;
        }
    });
    document.querySelectorAll('.cover-letter-company').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.coverLetters[index]) {
            editData.coverLetters[index].company = input.value;
        }
    });
    document.querySelectorAll('.cover-letter-content').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        if (editData.coverLetters[index]) {
            editData.coverLetters[index].content = textarea.value;
        }
    });
    document.querySelectorAll('.item-enabled[data-type="coverLetter"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.coverLetters[index]) {
            editData.coverLetters[index].enabled = checkbox.checked;
        }
    });
}

function moveCoverLetter(index, direction) {
    if (!editData.coverLetters) return;
    saveCoverLetterInputs();
    if (direction === 'up' && index > 0) {
        const temp = editData.coverLetters[index - 1];
        editData.coverLetters[index - 1] = editData.coverLetters[index];
        editData.coverLetters[index] = temp;
        renderCoverLetterEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.coverLetters.length - 1) {
        const temp = editData.coverLetters[index];
        editData.coverLetters[index] = editData.coverLetters[index + 1];
        editData.coverLetters[index + 1] = temp;
        renderCoverLetterEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deleteCoverLetter(index) {
    if (!editData.coverLetters) return;
    saveCoverLetterInputs(); // 먼저 현재 입력 값 저장
    editData.coverLetters.splice(index, 1);
    renderCoverLetterEdit(true); // skipSave=true로 전달하여 중복 저장 방지
}

// 포트폴리오 관련 함수들
function addPortfolio() {
    savePortfolioInputs(); // 먼저 현재 입력 값 저장
    if (!editData.portfolios) {
        editData.portfolios = [];
    }
    editData.portfolios.push({
        title: '',
        description: '',
        image: '',
        link: '',
        enabled: true
    });
    renderPortfolioEdit();
}

function renderPortfolioEdit(skipSave) {
    if (!skipSave) {
        savePortfolioInputs(); // 렌더링 전에 현재 입력 값 저장
    }
    if (!editData.portfolios) {
        editData.portfolios = [];
    }
    const container = document.getElementById('portfolioEditContainer');
    container.innerHTML = '';
    
    editData.portfolios.forEach((portfolio, index) => {
        const portfolioDiv = createPortfolioEditItem(portfolio, index);
        container.appendChild(portfolioDiv);
    });
}

function createPortfolioEditItem(portfolio, index) {
    const div = document.createElement('div');
    div.className = 'edit-item';
    div.setAttribute('data-index', index);
    div.innerHTML = `
        <div class="edit-item-header">
            <span class="edit-item-title">${portfolio.title || '새 포트폴리오'}</span>
            <div style="display: flex; gap: 5px;">
                <button type="button" class="move-btn" onclick="movePortfolio(${index}, 'up')" title="위로" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                <button type="button" class="move-btn" onclick="movePortfolio(${index}, 'down')" title="아래로" ${index === (editData.portfolios.length - 1) ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                <button type="button" class="delete-btn" onclick="deletePortfolio(${index})">삭제</button>
            </div>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" class="item-enabled" ${portfolio.enabled !== false ? 'checked' : ''} data-index="${index}" data-type="portfolio">
                활성화
            </label>
        </div>
        <div class="form-group">
            <label>제목:</label>
            <input type="text" class="portfolio-title" value="${portfolio.title || ''}" data-index="${index}" placeholder="예: 쇼핑몰 웹사이트">
        </div>
        <div class="form-group">
            <label>설명:</label>
            <textarea class="portfolio-description" data-index="${index}" rows="6" placeholder="포트폴리오 설명을 입력하세요">${portfolio.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>이미지 URL:</label>
            <input type="text" class="portfolio-image" value="${portfolio.image || ''}" data-index="${index}" placeholder="https://example.com/image.jpg">
        </div>
        <div class="form-group">
            <label>링크 URL:</label>
            <input type="url" class="portfolio-link" value="${portfolio.link || ''}" data-index="${index}" placeholder="https://example.com">
        </div>
    `;
    return div;
}

function savePortfolioInputs() {
    if (!editData.portfolios) return;
    document.querySelectorAll('.portfolio-title').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.portfolios[index]) {
            editData.portfolios[index].title = input.value;
        }
    });
    document.querySelectorAll('.portfolio-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        if (editData.portfolios[index]) {
            editData.portfolios[index].description = textarea.value;
        }
    });
    document.querySelectorAll('.portfolio-image').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.portfolios[index]) {
            editData.portfolios[index].image = input.value;
        }
    });
    document.querySelectorAll('.portfolio-link').forEach(input => {
        const index = parseInt(input.dataset.index);
        if (editData.portfolios[index]) {
            editData.portfolios[index].link = input.value;
        }
    });
    document.querySelectorAll('.item-enabled[data-type="portfolio"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        if (editData.portfolios[index]) {
            editData.portfolios[index].enabled = checkbox.checked;
        }
    });
}

function movePortfolio(index, direction) {
    if (!editData.portfolios) return;
    savePortfolioInputs();
    if (direction === 'up' && index > 0) {
        const temp = editData.portfolios[index - 1];
        editData.portfolios[index - 1] = editData.portfolios[index];
        editData.portfolios[index] = temp;
        renderPortfolioEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    } else if (direction === 'down' && index < editData.portfolios.length - 1) {
        const temp = editData.portfolios[index];
        editData.portfolios[index] = editData.portfolios[index + 1];
        editData.portfolios[index + 1] = temp;
        renderPortfolioEdit(true); // skipSave=true로 전달하여 중복 저장 방지
    }
}

function deletePortfolio(index) {
    if (!editData.portfolios) return;
    savePortfolioInputs(); // 먼저 현재 입력 값 저장
    editData.portfolios.splice(index, 1);
    renderPortfolioEdit(true); // skipSave=true로 전달하여 중복 저장 방지
}

// 저장 함수
function saveData() {
    // 먼저 모든 입력 필드 값 저장 (프로젝트 설명 포함)
    saveProjectInputs();
    
    // 프로필 정보
    const profileImageValue = document.getElementById('editProfileImage').value;
    if (profileImageValue) {
        editData.profile.image = profileImageValue;
        editData.profile.imageCropSize = currentCropSize;
    }
    editData.profile.name = document.getElementById('editProfileName').value;
    editData.profile.email = document.getElementById('editProfileEmail').value;
    editData.profile.phone = document.getElementById('editProfilePhone').value;
    editData.profile.links.line = document.getElementById('editProfileLine').value;
    editData.profile.links.github = document.getElementById('editProfileGithub').value;
    editData.profile.links.discord = document.getElementById('editProfileDiscord').value;
    editData.profile.links.youtube = document.getElementById('editProfileYoutube').value;
    editData.profile.links.facebook = document.getElementById('editProfileFacebook').value;
    editData.profile.links.instagram = document.getElementById('editProfileInstagram').value;
    editData.profile.enabled = document.getElementById('editProfileEnabled').checked;

    // INTRODUCE
    const introduceEditor = document.getElementById('editIntroduce');
    editData.introduce.content = introduceEditor ? introduceEditor.innerHTML : '';
    editData.enabled.introduce = document.getElementById('editIntroduceEnabled').checked;

    // SKILL
    document.querySelectorAll('.skill-category-name').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.skills[index].category = input.value;
    });
    document.querySelectorAll('.skill-enabled').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.skills[index].enabled = checkbox.checked;
    });

    // EXPERIENCE
    document.querySelectorAll('.experience-start-date').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.experiences[index].startDate = input.value;
    });
    document.querySelectorAll('.experience-end-date').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.experiences[index].endDate = input.value;
    });
    document.querySelectorAll('.experience-is-current').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.experiences[index].isCurrent = checkbox.checked;
    });
    document.querySelectorAll('.experience-employment-type').forEach(select => {
        const index = parseInt(select.dataset.index);
        editData.experiences[index].employmentType = select.value;
    });
    document.querySelectorAll('.experience-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.experiences[index].period = input.value;
    });
    document.querySelectorAll('.experience-company').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.experiences[index].company = input.value;
    });
    document.querySelectorAll('.experience-duration').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.experiences[index].duration = input.value;
    });
    document.querySelectorAll('.experience-role').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.experiences[index].role = input.value;
    });
    document.querySelectorAll('.experience-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        editData.experiences[index].description = textarea.value;
    });
    document.querySelectorAll('.experience-skills').forEach(input => {
        const index = parseInt(input.dataset.index);
        const skillsStr = input.value;
        editData.experiences[index].skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s) : [];
    });
    document.querySelectorAll('.item-enabled[data-type="experience"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.experiences[index].enabled = checkbox.checked;
    });

    // PROJECT
    document.querySelectorAll('.project-name').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.projects[index].name = input.value;
    });
    document.querySelectorAll('.project-client').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.projects[index].client = input.value;
    });
    document.querySelectorAll('.project-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.projects[index].period = input.value;
    });
    // 프로젝트 설명은 saveProjectInputs()에서 이미 저장되므로 여기서는 제거
    // (중복 저장 방지)
    document.querySelectorAll('.project-skills').forEach(input => {
        const index = parseInt(input.dataset.index);
        const skillsStr = input.value;
        editData.projects[index].skills = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(s => s) : [];
    });
    document.querySelectorAll('.project-links-edit .link-item').forEach(linkItem => {
        const projectIndex = parseInt(linkItem.querySelector('.link-label').dataset.index);
        const linkIndex = parseInt(linkItem.querySelector('.link-label').dataset.linkIndex);
        const label = linkItem.querySelector('.link-label').value;
        const url = linkItem.querySelector('.link-url').value;
        if (!editData.projects[projectIndex].links) {
            editData.projects[projectIndex].links = [];
        }
        if (editData.projects[projectIndex].links[linkIndex]) {
            editData.projects[projectIndex].links[linkIndex] = { label, url };
        }
    });
    document.querySelectorAll('.item-enabled[data-type="project"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.projects[index].enabled = checkbox.checked;
    });

    // OPEN SOURCE
    document.querySelectorAll('.opensource-name').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.opensources[index].name = input.value;
    });
    document.querySelectorAll('.opensource-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        editData.opensources[index].description = textarea.value;
    });
    document.querySelectorAll('.opensource-links-edit .link-item').forEach(linkItem => {
        const osIndex = parseInt(linkItem.querySelector('.link-label').dataset.index);
        const linkIndex = parseInt(linkItem.querySelector('.link-label').dataset.linkIndex);
        const label = linkItem.querySelector('.link-label').value;
        const url = linkItem.querySelector('.link-url').value;
        if (!editData.opensources[osIndex].links) {
            editData.opensources[osIndex].links = [];
        }
        if (editData.opensources[osIndex].links[linkIndex]) {
            editData.opensources[osIndex].links[linkIndex] = { label, url };
        }
    });
    document.querySelectorAll('.item-enabled[data-type="opensource"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.opensources[index].enabled = checkbox.checked;
    });

    // EDUCATION
    document.querySelectorAll('.education-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.educations[index].period = input.value;
    });
    document.querySelectorAll('.education-school').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.educations[index].school = input.value;
    });
    document.querySelectorAll('.education-major').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.educations[index].major = input.value;
    });
    document.querySelectorAll('.item-enabled[data-type="education"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.educations[index].enabled = checkbox.checked;
    });

    // ETC
    document.querySelectorAll('.etc-period').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.etcs[index].period = input.value;
    });
    document.querySelectorAll('.etc-title').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.etcs[index].title = input.value;
    });
    document.querySelectorAll('.etc-role').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.etcs[index].role = input.value;
    });
    document.querySelectorAll('.etc-description').forEach(textarea => {
        const index = parseInt(textarea.dataset.index);
        editData.etcs[index].description = textarea.value;
    });
    document.querySelectorAll('.item-enabled[data-type="etc"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.etcs[index].enabled = checkbox.checked;
    });

    // ARTICLE
    document.querySelectorAll('.article-title').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.articles[index].title = input.value;
    });
    document.querySelectorAll('.article-url').forEach(input => {
        const index = parseInt(input.dataset.index);
        editData.articles[index].url = input.value;
    });
    document.querySelectorAll('.item-enabled[data-type="article"]').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        editData.articles[index].enabled = checkbox.checked;
    });

    // 섹션 활성화 상태
    editData.enabled.skill = document.getElementById('editSkillEnabled').checked;
    editData.enabled.experience = document.getElementById('editExperienceEnabled').checked;
    editData.enabled.project = document.getElementById('editProjectEnabled').checked;
    editData.enabled.opensource = document.getElementById('editOpensourceEnabled').checked;
    editData.enabled.education = document.getElementById('editEducationEnabled').checked;
    editData.enabled.etc = document.getElementById('editEtcEnabled').checked;
    editData.enabled.article = document.getElementById('editArticleEnabled').checked;
    
    // 자기소개서 저장
    saveCoverLetterInputs();
    editData.enabled.coverLetter = document.getElementById('editCoverLetterEnabled').checked;
    
    // 포트폴리오 저장
    savePortfolioInputs();
    editData.enabled.portfolio = document.getElementById('editPortfolioEnabled').checked;

    // 섹션 순서 설정
    editData.sectionOrder = {
        experience: parseInt(document.getElementById('sectionOrderExperience').value) || 1,
        project: parseInt(document.getElementById('sectionOrderProject').value) || 2,
        opensource: parseInt(document.getElementById('sectionOrderOpensource').value) || 3,
        education: parseInt(document.getElementById('sectionOrderEducation').value) || 4,
        etc: parseInt(document.getElementById('sectionOrderEtc').value) || 5,
        article: parseInt(document.getElementById('sectionOrderArticle').value) || 6,
        coverLetter: parseInt(document.getElementById('sectionOrderCoverLetter').value) || 7,
        portfolio: parseInt(document.getElementById('sectionOrderPortfolio').value) || 8
    };

    // 저장
    // 저장 전 최종 확인
    console.log('저장할 데이터:', editData);
    console.log('프로젝트 설명들:', editData.projects.map((p, i) => ({ index: i, name: p.name, description: p.description })));
    
    ProfileData.save(editData);
    
    // 저장 확인
    const saved = localStorage.getItem('profileData');
    if (saved) {
        const savedData = JSON.parse(saved);
        console.log('저장된 데이터 확인:', savedData);
        console.log('저장된 프로젝트 설명들:', savedData.projects.map((p, i) => ({ index: i, name: p.name, description: p.description })));
    }
    
    alert('저장되었습니다!');
    window.location.href = 'index.html';
}

// 이벤트 리스너
document.getElementById('saveBtn').addEventListener('click', saveData);
document.getElementById('cancelBtn').addEventListener('click', function() {
    if (confirm('편집을 취소하시겠습니까?')) {
        window.location.href = 'index.html';
    }
});

// SKILL 카테고리 추가 버튼
document.getElementById('addSkillBtn').addEventListener('click', addSkillCategory);

// EXPERIENCE 추가 버튼
document.getElementById('addExperienceBtn').addEventListener('click', addExperience);

// PROJECT 추가 버튼
document.getElementById('addProjectBtn').addEventListener('click', addProject);

// OPEN SOURCE 추가 버튼
document.getElementById('addOpensourceBtn').addEventListener('click', addOpensource);

// EDUCATION 추가 버튼
document.getElementById('addEducationBtn').addEventListener('click', addEducation);

// ETC 추가 버튼
document.getElementById('addEtcBtn').addEventListener('click', addEtc);

// ARTICLE 추가 버튼
document.getElementById('addArticleBtn').addEventListener('click', addArticle);

// 자기소개서 추가 버튼
document.getElementById('addCoverLetterBtn').addEventListener('click', addCoverLetter);

// 포트폴리오 추가 버튼
document.getElementById('addPortfolioBtn').addEventListener('click', addPortfolio);

// SKILL 입력 엔터 키 처리
document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('new-skill-input') && e.key === 'Enter') {
        const index = parseInt(e.target.dataset.index);
        addSkillItem(index);
    }
});

// 이미지 파일 업로드 및 크롭 처리 (이미 위에 정의됨)

// 이미지 파일 업로드 및 크롭 처리
let currentCropImage = null;
let currentCropSize = 150;
let cropOverlayPosition = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', function() {
    loadEditData();
    
    // 이미지 파일 업로드 이벤트 리스너
    const imageFileInput = document.getElementById('editProfileImageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentCropImage = event.target.result;
                    showImageCropPreview(currentCropImage);
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function showImageCropPreview(imageSrc) {
    const container = document.getElementById('imageCropContainer');
    const previewImg = document.getElementById('cropPreviewImage');
    const overlay = document.getElementById('cropOverlay');
    const slider = document.getElementById('cropSizeSlider');
    
    if (!container || !previewImg || !overlay || !slider) return;
    
    container.style.display = 'block';
    previewImg.src = imageSrc;
    
    // 초기 위치 리셋
    cropOverlayPosition = { x: 0, y: 0 };
    
    previewImg.onload = function() {
        updateCropOverlay();
        setupCropDrag();
    };
    
    slider.oninput = function() {
        currentCropSize = parseInt(this.value);
        const sizeValue = document.getElementById('cropSizeValue');
        if (sizeValue) {
            sizeValue.textContent = currentCropSize + 'px';
        }
        updateCropOverlay();
    };
}

function setupCropDrag() {
    const overlay = document.getElementById('cropOverlay');
    const previewWrapper = document.querySelector('.crop-preview-wrapper');
    
    if (!overlay || !previewWrapper) return;
    
    // 마우스 다운 이벤트
    overlay.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = previewWrapper.getBoundingClientRect();
        dragStart.x = e.clientX - rect.left - cropOverlayPosition.x;
        dragStart.y = e.clientY - rect.top - cropOverlayPosition.y;
        e.preventDefault();
    });
    
    // 마우스 이동 이벤트
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const previewImg = document.getElementById('cropPreviewImage');
        const previewWrapper = document.querySelector('.crop-preview-wrapper');
        
        if (!previewImg || !previewWrapper) return;
        
        const rect = previewWrapper.getBoundingClientRect();
        const imgWidth = previewImg.offsetWidth || previewImg.naturalWidth;
        const imgHeight = previewImg.offsetHeight || previewImg.naturalHeight;
        const size = currentCropSize;
        
        // 새로운 위치 계산
        let newX = e.clientX - rect.left - dragStart.x;
        let newY = e.clientY - rect.top - dragStart.y;
        
        // 경계 체크
        newX = Math.max(0, Math.min(newX, imgWidth - size));
        newY = Math.max(0, Math.min(newY, imgHeight - size));
        
        cropOverlayPosition.x = newX;
        cropOverlayPosition.y = newY;
        
        updateCropOverlay();
    });
    
    // 마우스 업 이벤트
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // 터치 이벤트 지원
    overlay.addEventListener('touchstart', function(e) {
        isDragging = true;
        const rect = previewWrapper.getBoundingClientRect();
        const touch = e.touches[0];
        dragStart.x = touch.clientX - rect.left - cropOverlayPosition.x;
        dragStart.y = touch.clientY - rect.top - cropOverlayPosition.y;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const previewImg = document.getElementById('cropPreviewImage');
        const previewWrapper = document.querySelector('.crop-preview-wrapper');
        
        if (!previewImg || !previewWrapper) return;
        
        const rect = previewWrapper.getBoundingClientRect();
        const touch = e.touches[0];
        const imgWidth = previewImg.offsetWidth || previewImg.naturalWidth;
        const imgHeight = previewImg.offsetHeight || previewImg.naturalHeight;
        const size = currentCropSize;
        
        let newX = touch.clientX - rect.left - dragStart.x;
        let newY = touch.clientY - rect.top - dragStart.y;
        
        newX = Math.max(0, Math.min(newX, imgWidth - size));
        newY = Math.max(0, Math.min(newY, imgHeight - size));
        
        cropOverlayPosition.x = newX;
        cropOverlayPosition.y = newY;
        
        updateCropOverlay();
        e.preventDefault();
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
}

function updateCropOverlay() {
    const previewImg = document.getElementById('cropPreviewImage');
    const overlay = document.getElementById('cropOverlay');
    
    if (!previewImg || !overlay || !previewImg.complete) return;
    
    // 이미지가 로드될 때까지 대기
    if (previewImg.naturalWidth === 0) {
        setTimeout(updateCropOverlay, 100);
        return;
    }
    
    const imgWidth = previewImg.offsetWidth || previewImg.naturalWidth;
    const imgHeight = previewImg.offsetHeight || previewImg.naturalHeight;
    const size = currentCropSize;
    
    // 초기 위치 설정 (중앙)
    if (cropOverlayPosition.x === 0 && cropOverlayPosition.y === 0) {
        cropOverlayPosition.x = (imgWidth - size) / 2;
        cropOverlayPosition.y = (imgHeight - size) / 2;
    }
    
    // 경계 체크
    cropOverlayPosition.x = Math.max(0, Math.min(cropOverlayPosition.x, imgWidth - size));
    cropOverlayPosition.y = Math.max(0, Math.min(cropOverlayPosition.y, imgHeight - size));
    
    overlay.style.width = size + 'px';
    overlay.style.height = size + 'px';
    overlay.style.left = cropOverlayPosition.x + 'px';
    overlay.style.top = cropOverlayPosition.y + 'px';
}

function applyImageCrop() {
    if (!currentCropImage) return;
    
    const previewImg = document.getElementById('cropPreviewImage');
    const overlay = document.getElementById('cropOverlay');
    
    if (!previewImg || !overlay) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = currentCropSize;
    
    canvas.width = size;
    canvas.height = size;
    
    const img = new Image();
    img.onload = function() {
        const imgWidth = previewImg.offsetWidth || previewImg.naturalWidth;
        const imgHeight = previewImg.offsetHeight || previewImg.naturalHeight;
        const overlayLeft = overlay.offsetLeft;
        const overlayTop = overlay.offsetTop;
        
        const scaleX = img.width / imgWidth;
        const scaleY = img.height / imgHeight;
        
        const sx = overlayLeft * scaleX;
        const sy = overlayTop * scaleY;
        const sWidth = size * scaleX;
        const sHeight = size * scaleY;
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);
        
        const croppedImage = canvas.toDataURL('image/png');
        document.getElementById('editProfileImage').value = croppedImage;
        
        // 미리보기 업데이트
        const container = document.getElementById('imageCropContainer');
        if (container) {
            container.style.display = 'none';
        }
        
        alert('이미지가 크롭되어 적용되었습니다.');
    };
    img.src = currentCropImage;
}

// 리치 텍스트 편집 함수들
function formatText(command, value) {
    document.execCommand(command, false, value);
    const editor = document.getElementById('editIntroduce');
    if (editor) {
        editor.focus();
    }
}

function insertSpecialText(type) {
    const editor = document.getElementById('editIntroduce');
    if (!editor) return;
    
    editor.focus();
    
    if (type === 'date') {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const daysSince = Math.floor((today - new Date('2025-01-01')) / (1000 * 60 * 60 * 24));
        const dateText = `Latest Updated ${year}. ${month}. ${day} (D+${daysSince})`;
        document.execCommand('insertText', false, dateText);
    } else if (type === 'signature') {
        const signature = document.createElement('div');
        signature.style.cssText = 'text-align: right; font-family: cursive; margin-top: 20px;';
        signature.textContent = 'Lee HwaYoung';
        document.execCommand('insertHTML', false, signature.outerHTML);
    }
}

// 프로젝트 설명을 편집용으로 포맷팅 (텍스트의 \n을 <br>로 변환)
function formatProjectDescriptionForEdit(description) {
    if (!description) return '';
    // 이미 HTML 태그가 있으면 그대로 반환
    if (description.includes('<') && description.includes('>')) {
        // HTML인 경우: contenteditable에서 첫 번째 <br>가 제대로 표시되도록 처리
        // 첫 번째 <br> 앞에 빈 div를 추가하거나, <br>를 <div><br></div>로 변환
        let html = description;
        // 시작 부분의 <br>를 <div><br></div>로 변환하여 contenteditable에서 인식되도록
        html = html.replace(/^(<br\s*\/?>)/i, '<div><br></div>');
        return html;
    }
    // 텍스트 형식이면 \n을 <br>로 변환하고 HTML 특수문자 이스케이프
    let text = description
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    // 첫 번째 <br> 앞에 빈 div 추가
    if (text.startsWith('<br>')) {
        text = '<div><br></div>' + text.substring(4);
    }
    return text;
}

// 프로젝트 설명 포맷팅 함수
function formatProjectText(index, command) {
    const editor = document.querySelector(`.project-description[data-index="${index}"]`);
    if (!editor) return;
    
    editor.focus();
    document.execCommand(command, false, null);
}

// 현재 링크를 삽입할 프로젝트 인덱스 저장
let currentProjectIndexForLink = null;
// 커서 위치 저장
let savedSelection = null;

// 커서 위치 저장 함수
function saveSelection() {
    const editor = document.querySelector(`.project-description[data-index="${currentProjectIndexForLink}"]`);
    if (!editor) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // 편집기 내부의 범위인지 확인
        if (editor.contains(range.commonAncestorContainer) || range.commonAncestorContainer === editor) {
            savedSelection = range.cloneRange();
        }
    }
}

// 커서 위치 복원 함수
function restoreSelection() {
    const editor = document.querySelector(`.project-description[data-index="${currentProjectIndexForLink}"]`);
    if (!editor || !savedSelection) return false;
    
    try {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        editor.focus();
        return true;
    } catch (e) {
        console.error('커서 위치 복원 실패:', e);
        return false;
    }
}

// 프로젝트 설명 링크 삽입 함수 (모달 열기)
function insertProjectLink(index) {
    currentProjectIndexForLink = index;
    const editor = document.querySelector(`.project-description[data-index="${index}"]`);
    if (editor) {
        // 현재 커서 위치 저장
        saveSelection();
    }
    
    const modal = document.getElementById('linkModal');
    if (modal) {
        // 입력 필드 초기화
        document.getElementById('linkModalUrl').value = '';
        document.getElementById('linkModalText').value = '';
        modal.style.display = 'block';
        // URL 입력 필드에 포커스
        setTimeout(() => {
            document.getElementById('linkModalUrl').focus();
        }, 100);
    }
}

// 모달 닫기
function closeLinkModal() {
    const modal = document.getElementById('linkModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentProjectIndexForLink = null;
    savedSelection = null;
}

// 클립보드에서 붙여넣기
async function pasteFromClipboard(type) {
    try {
        const text = await navigator.clipboard.readText();
        if (type === 'url') {
            document.getElementById('linkModalUrl').value = text;
        } else if (type === 'text') {
            document.getElementById('linkModalText').value = text;
        }
    } catch (err) {
        // 클립보드 접근 실패 시 수동 입력 안내
        alert('클립보드 접근에 실패했습니다. 직접 입력해주세요.');
    }
}

// 모달에서 링크 삽입
function insertLinkFromModal() {
    if (currentProjectIndexForLink === null) return;
    
    const url = document.getElementById('linkModalUrl').value.trim();
    if (!url) {
        alert('URL을 입력해주세요.');
        return;
    }
    
    const text = document.getElementById('linkModalText').value.trim() || url;
    
    const editor = document.querySelector(`.project-description[data-index="${currentProjectIndexForLink}"]`);
    if (!editor) {
        closeLinkModal();
        return;
    }
    
    // 커서 위치 복원 시도
    const restored = restoreSelection();
    if (!restored) {
        // 복원 실패 시 편집기 끝에 커서 이동
        editor.focus();
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false); // 끝으로 이동
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    // 링크 HTML 생성
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    
    // 커서 위치에 링크 삽입
    document.execCommand('insertHTML', false, linkHtml);
    
    // 커서를 링크 뒤로 이동
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.collapse(false); // 링크 뒤로 이동
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    savedSelection = null;
    closeLinkModal();
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('linkModal');
    if (event.target === modal) {
        closeLinkModal();
    }
}

// 모달에서 Enter 키로 삽입, ESC 키로 닫기
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('linkModalUrl');
    const textInput = document.getElementById('linkModalText');
    
    if (urlInput) {
        urlInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                insertLinkFromModal();
            } else if (e.key === 'Escape') {
                closeLinkModal();
            }
        });
    }
    
    if (textInput) {
        textInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                insertLinkFromModal();
            } else if (e.key === 'Escape') {
                closeLinkModal();
            }
        });
    }
});

