// 데이터 로드 및 화면 렌더링
const ProfileData = {
    load: function() {
        const saved = localStorage.getItem('profileData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // 데이터 검증만 하고 자동 복구는 하지 않음 (데이터 손실 방지)
                return data;
            } catch (e) {
                console.error('데이터 파싱 오류:', e);
                return this.getDefaultData();
            }
        }
        return this.getDefaultData();
    },

    save: function(data) {
        // 이전 데이터를 백업으로 저장 (최대 10개까지)
        const backupKey = 'profileData_backup';
        const backups = JSON.parse(localStorage.getItem(backupKey) || '[]');
        
        // 현재 데이터를 백업에 추가 (타임스탬프 포함)
        const backup = {
            timestamp: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(data)) // 깊은 복사
        };
        backups.push(backup);
        
        // 최대 10개까지만 보관 (오래된 것부터 삭제)
        if (backups.length > 10) {
            backups.shift();
        }
        
        localStorage.setItem(backupKey, JSON.stringify(backups));
        localStorage.setItem('profileData', JSON.stringify(data));
    },
    
    // 백업 데이터 조회
    getBackups: function() {
        const backupKey = 'profileData_backup';
        return JSON.parse(localStorage.getItem(backupKey) || '[]');
    },
    
    // 특정 시간의 백업 데이터 복원
    restoreBackup: function(timestamp) {
        const backups = this.getBackups();
        const backup = backups.find(b => b.timestamp === timestamp);
        if (backup) {
            this.save(backup.data);
            return backup.data;
        }
        return null;
    },

    getDefaultData: function() {
        return {
            profile: {
                image: '',
                name: '이름',
                email: '이메일',
                phone: '',
                links: {
                    line: '',
                    github: '',
                    discord: '',
                    youtube: '',
                    facebook: '',
                    instagram: ''
                },
                enabled: true
            },
            introduce: {
                content: '새로운 도전에 긍정적인 개발자입니다. 다양한 프로젝트에서 백엔드 및 웹 개발을 담당해왔습니다. Spring Framework 기반의 시스템 개발과 유지보수에 전문성을 가지고 있으며, 최근에는 React.js와 Spring Boot를 활용한 프론트-백엔드 통합 개발 경험도 쌓아왔습니다.',
                enabled: true
            },
            skills: [
                {
                    category: 'Languages',
                    items: ['Java', 'JavaScript', 'Python', 'HTML/CSS'],
                    enabled: true
                },
                {
                    category: 'Frameworks & Libraries',
                    items: ['Spring Boot', 'React.js', 'Node.js'],
                    enabled: true
                },
                {
                    category: 'Databases',
                    items: ['MySQL', 'PostgreSQL'],
                    enabled: true
                },
                {
                    category: 'Tools',
                    items: ['Git', 'IntelliJ IDEA'],
                    enabled: true
                }
            ],
            experiences: [
                {
                    startDate: '2024-01-01',
                    endDate: '2024-12-31',
                    isCurrent: false,
                    employmentType: '정규직',
                    period: '2024. 01 ~ 2024. 12',
                    company: '예시 회사명',
                    duration: '1년',
                    role: '백엔드 개발자',
                    description: '* 웹 애플리케이션 개발 및 유지보수\n* API 설계 및 구현\n* 데이터베이스 설계 및 최적화',
                    skills: ['Java', 'Spring Boot', 'MySQL', 'RESTful API'],
                    enabled: true
                }
            ],
            projects: [
                {
                    name: '예시 프로젝트 1',
                    period: '2024. 01 ~ 2024. 06',
                    client: '예시 고객사',
                    description: '웹 애플리케이션 개발\n* 백엔드 API 개발\n* 프론트엔드 UI 구현\n* 데이터베이스 설계',
                    skills: ['Java', 'Spring Boot', 'React.js', 'MySQL'],
                    links: [],
                    enabled: true
                },
                {
                    name: '예시 프로젝트 2',
                    period: '2023. 07 ~ 2023. 12',
                    description: '시스템 유지보수 및 기능 개선',
                    skills: ['Java', 'JavaScript', 'Oracle'],
                    links: [],
                    enabled: true
                }
            ],
            opensources: [],
            educations: [
                {
                    period: '2020. 03 ~ 2024. 02',
                    school: '예시 대학교',
                    major: '컴퓨터공학과 졸업',
                    enabled: true
                }
            ],
            etcs: [],
            articles: [],
            coverLetters: [],
            portfolios: [],
            enabled: {
                introduce: true,
                skill: true,
                experience: true,
                project: true,
                opensource: true,
                education: true,
                etc: true,
                article: true,
                coverLetter: true,
                portfolio: true
            },
            sectionOrder: {
                experience: 1,
                project: 2,
                opensource: 3,
                education: 4,
                etc: 5,
                article: 6,
                coverLetter: 7,
                portfolio: 8
            }
        };
    }
};

// 화면 렌더링
function renderProfile() {
    const data = ProfileData.load();

    // 프로필 섹션
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return; // edit.html에서는 실행하지 않음
    
    if (data.profile.enabled) {
        profileSection.classList.remove('hidden');
        const profileImg = document.getElementById('profileImage');
        if (data.profile.image) {
            profileImg.src = data.profile.image;
            profileImg.style.display = 'block';
        } else {
            profileImg.style.display = 'none';
        }
        document.getElementById('profileName').textContent = data.profile.name;
        const emailEl = document.getElementById('profileEmail');
        emailEl.innerHTML = data.profile.email ? `<i class="fas fa-envelope" style="margin-right: 8px; color: #666;"></i>${data.profile.email}` : '';
        
        const phoneEl = document.getElementById('profilePhone');
        if (data.profile.phone) {
            phoneEl.innerHTML = `<i class="fas fa-phone" style="margin-right: 8px; color: #666;"></i>${data.profile.phone}`;
            phoneEl.classList.add('show');
        } else {
            phoneEl.classList.remove('show');
        }

        const linksEl = document.getElementById('profileLinks');
        linksEl.innerHTML = '';
        if (data.profile.links.line) {
            const lineUrl = data.profile.links.line.startsWith('http') ? data.profile.links.line : `https://line.me/ti/p/${data.profile.links.line}`;
            linksEl.innerHTML += `<a href="${lineUrl}" target="_blank"><i class="fab fa-line"></i> Line</a>`;
        }
        if (data.profile.links.github) {
            linksEl.innerHTML += `<a href="${data.profile.links.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>`;
        }
        if (data.profile.links.discord) {
            const discordUrl = data.profile.links.discord.startsWith('http') ? data.profile.links.discord : `https://discord.com/users/${data.profile.links.discord}`;
            linksEl.innerHTML += `<a href="${discordUrl}" target="_blank"><i class="fab fa-discord"></i> Discord</a>`;
        }
        if (data.profile.links.youtube) {
            linksEl.innerHTML += `<a href="${data.profile.links.youtube}" target="_blank"><i class="fab fa-youtube"></i> YouTube</a>`;
        }
        if (data.profile.links.facebook) {
            linksEl.innerHTML += `<a href="${data.profile.links.facebook}" target="_blank"><i class="fab fa-facebook"></i> Facebook</a>`;
        }
        if (data.profile.links.instagram) {
            linksEl.innerHTML += `<a href="${data.profile.links.instagram}" target="_blank"><i class="fab fa-instagram"></i> Instagram</a>`;
        }
    } else {
        document.getElementById('profileSection').classList.add('hidden');
    }

    // INTRODUCE
    if (data.enabled.introduce && data.introduce.enabled) {
        document.getElementById('introduceSection').classList.remove('hidden');
        document.getElementById('introduceContent').innerHTML = data.introduce.content || '';
    } else {
        document.getElementById('introduceSection').classList.add('hidden');
    }

    // SKILL
    if (data.enabled.skill) {
        document.getElementById('skillSection').classList.remove('hidden');
        const skillContent = document.getElementById('skillContent');
        skillContent.innerHTML = '';
        data.skills.forEach(skill => {
            if (skill.enabled) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'skill-category';
                categoryDiv.innerHTML = `
                    <h3>${skill.category}</h3>
                    <div class="skill-items">
                        ${skill.items.map(item => `<span class="skill-item">${item}</span>`).join('')}
                    </div>
                `;
                skillContent.appendChild(categoryDiv);
            }
        });
    } else {
        document.getElementById('skillSection').classList.add('hidden');
    }

    // 섹션 순서 설정 및 재배치
    const sectionOrder = data.sectionOrder || {
        experience: 1,
        project: 2,
        opensource: 3,
        education: 4,
        etc: 5,
        article: 6,
        coverLetter: 7,
        portfolio: 8
    };
    
    // 섹션들을 순서대로 정렬
    const sections = [
        { key: 'experience', id: 'experienceSection', render: renderExperience },
        { key: 'project', id: 'projectSection', render: renderProject },
        { key: 'opensource', id: 'opensourceSection', render: renderOpensource },
        { key: 'education', id: 'educationSection', render: renderEducation },
        { key: 'etc', id: 'etcSection', render: renderEtc },
        { key: 'article', id: 'articleSection', render: renderArticle },
        { key: 'coverLetter', id: 'coverLetterSection', render: renderCoverLetter },
        { key: 'portfolio', id: 'portfolioSection', render: renderPortfolio }
    ];
    
    // 먼저 모든 섹션 렌더링 (초기 상태 설정 및 내용 채우기)
    sections.forEach(section => {
        section.render(data);
    });
    
    // 순서대로 정렬
    sections.sort((a, b) => (sectionOrder[a.key] || 999) - (sectionOrder[b.key] || 999));
    
    // 컨테이너 참조
    const container = document.querySelector('.container');
    const skillSection = document.getElementById('skillSection'); // SKILL 섹션 뒤에 삽입 시작
    
    // 순서대로 재배치
    let insertAfter = skillSection;
    sections.forEach(section => {
        const sectionEl = document.getElementById(section.id);
        if (sectionEl && !sectionEl.classList.contains('hidden')) {
            // 현재 위치가 이미 올바르면 이동하지 않음
            if (insertAfter.nextSibling !== sectionEl) {
                container.insertBefore(sectionEl, insertAfter.nextSibling);
            }
            insertAfter = sectionEl;
        }
    });
    
}

function renderExperience(data) {
    if (data.enabled.experience && data.experiences && data.experiences.length > 0) {
        const hasEnabled = data.experiences.some(exp => exp.enabled);
        if (hasEnabled) {
            document.getElementById('experienceSection').classList.remove('hidden');
            
            // 총 경력 계산
            const totalDuration = calculateTotalExperience(data.experiences);
            const experienceTitle = document.querySelector('#experienceSection h2');
            if (experienceTitle && totalDuration) {
                experienceTitle.innerHTML = `EXPERIENCE <span style="font-size: 16px; color: #666; font-weight: normal;">총 ${totalDuration}</span>`;
            }
            
            const expContent = document.getElementById('experienceContent');
            expContent.innerHTML = '';
            data.experiences.forEach(exp => {
                if (exp.enabled) {
                    const expDiv = document.createElement('div');
                    expDiv.className = 'experience-item';
                    const startDate = exp.startDate ? formatDateForDisplay(exp.startDate) : '';
                    const endDate = exp.isCurrent ? '현재' : (exp.endDate ? formatDateForDisplay(exp.endDate) : '');
                    const period = exp.period || (startDate && endDate ? `${startDate} ~ ${endDate}` : '');
                    
                    expDiv.innerHTML = `
                        <div class="experience-header">
                            <div class="experience-period">${period}</div>
                            <div class="experience-company">${exp.company}</div>
                            <div class="experience-duration">${exp.duration || ''} ${exp.employmentType ? `(${exp.employmentType})` : ''}</div>
                            <div class="experience-role">${exp.role || ''}</div>
                        </div>
                        <div class="experience-description">${formatDescription(exp.description)}</div>
                        ${exp.skills && exp.skills.length > 0 ? `
                            <div class="experience-skills">
                                <strong>Skill Keywords:</strong>
                                <div class="skill-items">
                                    ${exp.skills.map(s => `<span class="skill-item">${s}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    `;
                    expContent.appendChild(expDiv);
                }
            });
        } else {
            document.getElementById('experienceSection').classList.add('hidden');
        }
    } else {
        document.getElementById('experienceSection').classList.add('hidden');
    }
}

function renderProject(data) {
    const projectSection = document.getElementById('projectSection');
    if (!projectSection) {
        return; // 요소가 없으면 (edit.html 등) 실행하지 않음
    }
    
    // 데이터 검증
    if (!data) {
        projectSection.classList.add('hidden');
        return;
    }
    
    // enabled 확인
    if (!data.enabled || data.enabled.project === false) {
        projectSection.classList.add('hidden');
        return;
    }
    
    // projects 배열 확인
    if (!data.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
        projectSection.classList.add('hidden');
        return;
    }
    
    // 활성화된 프로젝트 확인
    const enabledProjects = data.projects.filter(proj => proj.enabled !== false);
    if (enabledProjects.length === 0) {
        projectSection.classList.add('hidden');
        return;
    }
    
    // 프로젝트 섹션 표시
    projectSection.classList.remove('hidden');
    const projContent = document.getElementById('projectContent');
    if (!projContent) {
        console.error('renderProject: projectContent 요소를 찾을 수 없습니다.');
        return;
    }
    
    projContent.innerHTML = '';
    
    // 각 프로젝트 렌더링
    enabledProjects.forEach((proj) => {
        const projDiv = document.createElement('div');
        projDiv.className = 'project-item';
        
        // description이 없으면 빈 문자열로 처리
        const description = proj.description || '';
        
        projDiv.innerHTML = `
            <div class="project-header">
                <div class="project-name">${proj.name || ''}</div>
                ${proj.client ? `<div class="project-client">고객사: ${proj.client}</div>` : ''}
                <div class="project-period">${proj.period || ''}</div>
            </div>
            <div class="project-description">${formatDescription(description)}</div>
            ${proj.skills && proj.skills.length > 0 ? `
                <div class="project-skills">
                    <strong>기술 스택:</strong>
                    <div class="skill-items">
                        ${proj.skills.map(s => `<span class="skill-item">${s}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            ${proj.links && proj.links.length > 0 ? `
                <div class="project-links">
                    ${proj.links.map(link => `<a href="${link.url}" target="_blank">${link.label || link.url}</a>`).join('')}
                </div>
            ` : ''}
        `;
        projContent.appendChild(projDiv);
    });
}

function renderOpensource(data) {
    if (data.enabled.opensource && data.opensources && data.opensources.length > 0) {
        const hasEnabled = data.opensources.some(os => os.enabled);
        if (hasEnabled) {
            document.getElementById('opensourceSection').classList.remove('hidden');
            const osContent = document.getElementById('opensourceContent');
            osContent.innerHTML = '';
            data.opensources.forEach(os => {
                if (os.enabled) {
                    const osDiv = document.createElement('div');
                    osDiv.className = 'opensource-item';
                    osDiv.innerHTML = `
                        <div class="opensource-name">${os.name}</div>
                        <div class="opensource-description">${formatDescription(os.description)}</div>
                        ${os.links && os.links.length > 0 ? `
                            <div class="opensource-links">
                                ${os.links.map(link => `<a href="${link.url}" target="_blank">${link.label || link.url}</a>`).join('')}
                            </div>
                        ` : ''}
                    `;
                    osContent.appendChild(osDiv);
                }
            });
        } else {
            document.getElementById('opensourceSection').classList.add('hidden');
        }
    } else {
        document.getElementById('opensourceSection').classList.add('hidden');
    }
}

function renderEducation(data) {
    if (data.enabled.education && data.educations && data.educations.length > 0) {
        const hasEnabled = data.educations.some(edu => edu.enabled);
        if (hasEnabled) {
            document.getElementById('educationSection').classList.remove('hidden');
            const eduContent = document.getElementById('educationContent');
            eduContent.innerHTML = '';
            data.educations.forEach(edu => {
                if (edu.enabled) {
                    const eduDiv = document.createElement('div');
                    eduDiv.className = 'education-item';
                    eduDiv.innerHTML = `
                        <div class="education-period">${edu.period}</div>
                        <div class="education-school">${edu.school}</div>
                        <div class="education-major">${edu.major || ''}</div>
                    `;
                    eduContent.appendChild(eduDiv);
                }
            });
        } else {
            document.getElementById('educationSection').classList.add('hidden');
        }
    } else {
        document.getElementById('educationSection').classList.add('hidden');
    }
}

function renderEtc(data) {
    if (data.enabled.etc && data.etcs && data.etcs.length > 0) {
        const hasEnabled = data.etcs.some(etc => etc.enabled);
        if (hasEnabled) {
            document.getElementById('etcSection').classList.remove('hidden');
            const etcContent = document.getElementById('etcContent');
            etcContent.innerHTML = '';
            data.etcs.forEach(etc => {
                if (etc.enabled) {
                    const etcDiv = document.createElement('div');
                    etcDiv.className = 'etc-item';
                    etcDiv.innerHTML = `
                        <div class="etc-period">${etc.period}</div>
                        <div class="etc-title">${etc.title}</div>
                        ${etc.role ? `<div class="etc-role">${etc.role}</div>` : ''}
                        ${etc.description ? `<div class="etc-description">${formatDescription(etc.description)}</div>` : ''}
                    `;
                    etcContent.appendChild(etcDiv);
                }
            });
        } else {
            document.getElementById('etcSection').classList.add('hidden');
        }
    } else {
        document.getElementById('etcSection').classList.add('hidden');
    }
}

function renderArticle(data) {
    if (data.enabled.article && data.articles && data.articles.length > 0) {
        const hasEnabled = data.articles.some(article => article.enabled);
        if (hasEnabled) {
            document.getElementById('articleSection').classList.remove('hidden');
            const articleContent = document.getElementById('articleContent');
            articleContent.innerHTML = '';
            const ul = document.createElement('ul');
            ul.className = 'article-list';
            data.articles.forEach(article => {
                if (article.enabled) {
                    const li = document.createElement('li');
                    li.className = 'article-item';
                    li.innerHTML = `<a href="${article.url || '#'}" target="_blank">${article.title}</a>`;
                    ul.appendChild(li);
                }
            });
            articleContent.appendChild(ul);
        } else {
            document.getElementById('articleSection').classList.add('hidden');
        }
    } else {
        document.getElementById('articleSection').classList.add('hidden');
    }
}

function renderCoverLetter(data) {
    const coverLetterSection = document.getElementById('coverLetterSection');
    if (!coverLetterSection) return;
    
    if (data.enabled.coverLetter && data.coverLetters && data.coverLetters.length > 0) {
        const hasEnabled = data.coverLetters.some(letter => letter.enabled);
        if (hasEnabled) {
            coverLetterSection.classList.remove('hidden');
            const coverLetterContent = document.getElementById('coverLetterContent');
            coverLetterContent.innerHTML = '';
            data.coverLetters.forEach(letter => {
                if (letter.enabled) {
                    const letterDiv = document.createElement('div');
                    letterDiv.className = 'cover-letter-item';
                    letterDiv.innerHTML = `
                        <div class="cover-letter-header">
                            <h3>${letter.title || '자기소개서'}</h3>
                            ${letter.company ? `<div class="cover-letter-subtitle">${letter.company}</div>` : ''}
                        </div>
                        <div class="cover-letter-content">${formatDescription(letter.content)}</div>
                    `;
                    coverLetterContent.appendChild(letterDiv);
                }
            });
        } else {
            coverLetterSection.classList.add('hidden');
        }
    } else {
        coverLetterSection.classList.add('hidden');
    }
}

function renderPortfolio(data) {
    const portfolioSection = document.getElementById('portfolioSection');
    if (!portfolioSection) return;
    
    if (data.enabled.portfolio && data.portfolios && data.portfolios.length > 0) {
        const hasEnabled = data.portfolios.some(portfolio => portfolio.enabled);
        if (hasEnabled) {
            portfolioSection.classList.remove('hidden');
            const portfolioContent = document.getElementById('portfolioContent');
            portfolioContent.innerHTML = '';
            data.portfolios.forEach(portfolio => {
                if (portfolio.enabled) {
                    const portfolioDiv = document.createElement('div');
                    portfolioDiv.className = 'portfolio-item';
                    portfolioDiv.innerHTML = `
                        <div class="portfolio-header">
                            <h3>${portfolio.title || '포트폴리오'}</h3>
                            ${portfolio.link ? `<a href="${portfolio.link}" target="_blank" class="portfolio-link-btn">보러가기 <i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                        ${portfolio.image ? `<div class="portfolio-image-container"><img src="${portfolio.image}" alt="${portfolio.title}" class="portfolio-image"></div>` : ''}
                        <div class="portfolio-description">${formatDescription(portfolio.description)}</div>
                    `;
                    portfolioContent.appendChild(portfolioDiv);
                }
            });
        } else {
            portfolioSection.classList.add('hidden');
        }
    } else {
        portfolioSection.classList.add('hidden');
    }
}

function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}. ${month}`;
}

function calculateTotalExperience(experiences) {
    if (!experiences || experiences.length === 0) return '';
    
    // duration 필드가 있으면 우선 사용 (잡코리아 방식)
    let totalMonths = 0;
    let hasDuration = false;
    
    experiences.forEach(exp => {
        if (!exp.enabled) return;
        
        // duration 필드가 있으면 파싱해서 사용
        if (exp.duration) {
            hasDuration = true;
            const durationStr = exp.duration.trim();
            
            // "X년 Y개월", "X년", "Y개월" 형식 파싱
            const yearMatch = durationStr.match(/(\d+)년/);
            const monthMatch = durationStr.match(/(\d+)개월/);
            
            if (yearMatch) {
                totalMonths += parseInt(yearMatch[1]) * 12;
            }
            if (monthMatch) {
                totalMonths += parseInt(monthMatch[1]);
            }
        }
    });
    
    // duration 필드가 없으면 날짜로 계산
    if (!hasDuration) {
        const today = new Date();
        
        experiences.forEach(exp => {
            if (!exp.enabled) return;
            
            const startDate = exp.startDate ? new Date(exp.startDate) : null;
            const endDate = exp.isCurrent ? today : (exp.endDate ? new Date(exp.endDate) : null);
            
            if (!startDate || !endDate) return;
            
            // 년/월 단위로 계산 (일자는 무시)
            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            totalMonths += years * 12 + months;
        });
    }
    
    if (totalMonths === 0) return '';
    
    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    
    let result = '';
    if (totalYears > 0) {
        result += `${totalYears}년 `;
    }
    if (remainingMonths > 0) {
        result += `${remainingMonths}개월`;
    }
    
    return result.trim();
}

function formatDescription(text) {
    if (!text) return '';
    
    // HTML 이스케이프 헬퍼 함수
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
    
    // HTML 태그가 포함되어 있는지 확인
    const hasHtmlTags = /<[^>]+>/g.test(text);
    
    if (hasHtmlTags) {
        // HTML이 포함된 경우: HTML을 그대로 반환 (안전하게)
        // XSS 방지를 위해 허용된 태그만 유지
        
        // 먼저 <div>와 <p> 태그를 <br>로 변환 (저장 시 변환되지 않은 경우 대비)
        let processedText = text;
        processedText = processedText.replace(/<\/div>/gi, '<br>');
        processedText = processedText.replace(/<\/p>/gi, '<br>');
        processedText = processedText.replace(/<div[^>]*>/gi, '');
        processedText = processedText.replace(/<p[^>]*>/gi, '');
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedText;
        
        // 안전한 태그만 허용 (a, br, ul, ol, li, strong, em, u)
        const allowedTags = ['a', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u'];
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
        );
        
        const nodesToRemove = [];
        let node;
        while (node = walker.nextNode()) {
            if (!allowedTags.includes(node.tagName.toLowerCase())) {
                nodesToRemove.push(node);
            }
        }
        
        nodesToRemove.forEach(n => {
            const parent = n.parentNode;
            while (n.firstChild) {
                parent.insertBefore(n.firstChild, n);
            }
            parent.removeChild(n);
        });
        
        // <br> 태그가 제대로 표시되도록 보장
        let result = tempDiv.innerHTML;
        // <br> 태그 정규화
        result = result.replace(/<br\s*\/?>/gi, '<br>');
        
        return result;
    } else {
        // HTML이 없는 경우 (기존 텍스트 데이터): \n을 <br>로 변환
        const lines = text.split('\n');
        let inList = false;
        let result = '';
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                if (!inList) {
                    result += '<ul>';
                    inList = true;
                }
                result += `<li>${escapeHtml(trimmed.substring(2))}</li>`;
            } else {
                if (inList) {
                    result += '</ul>';
                    inList = false;
                }
                if (line.trim()) {
                    // 빈 줄이 아닌 경우
                    result += `${escapeHtml(line)}<br>`;
                } else {
                    // 빈 줄인 경우
                    result += '<br>';
                }
            }
        });
        
        if (inList) {
            result += '</ul>';
        }
        
        return result || escapeHtml(text);
    }
}

// 기본 데이터로 리셋
function resetToDefault() {
    const message = '저장된 모든 데이터가 삭제되고 기본 데이터로 초기화됩니다.\n\n개인정보(이름, 이메일, 전화번호 등)도 모두 초기값으로 되돌아갑니다.\n\n⚠️ 주의: 이 작업은 되돌릴 수 없습니다!\n\n정말로 계속하시겠습니까?';
    if (confirm(message)) {
        try {
            // localStorage 완전 삭제 (모든 관련 데이터)
            localStorage.removeItem('profileData');
            localStorage.removeItem('profileData_backup'); // 백업 데이터도 삭제
            
            // 기본 데이터 가져오기
            const defaultData = ProfileData.getDefaultData();
            
            // 기본 데이터 검증
            if (!defaultData.projects || !Array.isArray(defaultData.projects) || defaultData.projects.length === 0) {
                alert('오류: 기본 데이터가 유효하지 않습니다.');
                console.error('기본 프로젝트 데이터가 없습니다.');
                return;
            }
            
            // 각 프로젝트의 description 확인 (빈 문자열도 허용)
            const invalidProjects = defaultData.projects.filter(proj => proj.description === undefined || proj.description === null || typeof proj.description !== 'string');
            if (invalidProjects.length > 0) {
                alert('오류: 기본 데이터의 프로젝트 설명이 유효하지 않습니다.');
                console.error('유효하지 않은 프로젝트:', invalidProjects);
                return;
            }
            
            // 기본 데이터를 localStorage에 직접 저장 (백업 생성 없이)
            localStorage.setItem('profileData', JSON.stringify(defaultData));
            
            // 저장 확인
            const saved = localStorage.getItem('profileData');
            if (!saved) {
                alert('오류: 데이터 저장에 실패했습니다.');
                console.error('데이터 저장 실패');
                return;
            }
            
            alert('기본 데이터로 리셋되었습니다. 페이지를 새로고침합니다.');
            // 강제 새로고침 (캐시 무시)
            location.reload(true);
        } catch (e) {
            alert('오류가 발생했습니다: ' + e.message);
            console.error('리셋 오류:', e);
        }
    }
}

// 데이터 백업 (JSON 파일로 다운로드)
function backupData() {
    try {
        const data = ProfileData.load();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // 로컬 시간 기준으로 YYYYMMDDHHmmss 형식 생성
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
        
        a.download = `profile-backup-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('백업 파일이 다운로드되었습니다.');
    } catch (e) {
        alert('백업 중 오류가 발생했습니다: ' + e.message);
        console.error('백업 오류:', e);
    }
}

// 데이터 복원 (JSON 파일 업로드)
function restoreData() {
    const fileInput = document.getElementById('restoreFileInput');
    if (fileInput) {
        fileInput.click();
    }
}

// 파일 선택 후 처리
function handleRestoreFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 데이터 검증
            if (!data.profile || !data.projects) {
                alert('올바른 백업 파일이 아닙니다.');
                return;
            }
            
            if (confirm('이 백업 파일로 데이터를 복원하시겠습니까?\n\n현재 데이터는 백업으로 저장됩니다.')) {
                // 현재 데이터를 먼저 백업
                const currentData = ProfileData.load();
                ProfileData.save(currentData);
                
                // 복원할 데이터 저장
                ProfileData.save(data);
                
                alert('데이터가 복원되었습니다. 페이지를 새로고침합니다.');
                location.reload();
            }
        } catch (e) {
            alert('파일을 읽는 중 오류가 발생했습니다: ' + e.message);
            console.error('복원 오류:', e);
        }
    };
    reader.readAsText(file);
    
    // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
    event.target.value = '';
}

// 백업 이력 보기
function showBackupHistory() {
    const backups = ProfileData.getBackups();
    
    if (backups.length === 0) {
        alert('저장된 백업이 없습니다.\n\n앞으로는 저장할 때마다 자동으로 백업이 생성됩니다.');
        return;
    }
    
    // 백업 목록을 시간순으로 정렬 (최신순)
    const sortedBackups = [...backups].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 백업 목록 표시
    let message = '백업 이력 (최신순):\n\n';
    sortedBackups.forEach((backup, index) => {
        const date = new Date(backup.timestamp);
        const timeStr = date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        message += `${index + 1}. ${timeStr}\n`;
    });
    
    message += '\n복원할 백업 번호를 입력하세요 (취소: 0):';
    const choice = prompt(message);
    
    if (choice && choice !== '0' && choice !== '') {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < sortedBackups.length) {
            const selectedBackup = sortedBackups[index];
            const date = new Date(selectedBackup.timestamp);
            const timeStr = date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            if (confirm(`이 백업으로 복원하시겠습니까?\n\n시간: ${timeStr}\n\n현재 데이터는 백업으로 저장됩니다.`)) {
                // 현재 데이터를 먼저 백업
                const currentData = ProfileData.load();
                ProfileData.save(currentData);
                // 선택한 백업으로 복원
                ProfileData.restoreBackup(selectedBackup.timestamp);
                alert('백업이 복원되었습니다. 페이지를 새로고침합니다.');
                location.reload();
            }
        } else {
            alert('잘못된 번호입니다.');
        }
    }
}

// 편집 버튼 클릭
const editBtn = document.getElementById('editBtn');
if (editBtn) {
    editBtn.addEventListener('click', function() {
        window.location.href = 'edit.html';
    });
}

// 최상단 이동 버튼
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// PDF 다운로드 함수
function downloadPDF() {
    // html2pdf 라이브러리 사용
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = function() {
        // 버튼들 숨기기
        const headerActions = document.getElementById('headerActions');
        const scrollBtn = document.getElementById('scrollToTopBtn');
        const backupBtn = document.getElementById('backupBtn');
        const restoreBtn = document.getElementById('restoreBtn');
        
        const originalHeaderDisplay = headerActions ? headerActions.style.display : '';
        const originalScrollDisplay = scrollBtn ? scrollBtn.style.display : '';
        const originalBackupDisplay = backupBtn ? backupBtn.style.display : '';
        const originalRestoreDisplay = restoreBtn ? restoreBtn.style.display : '';
        
        if (headerActions) headerActions.style.display = 'none';
        if (scrollBtn) scrollBtn.style.display = 'none';
        if (backupBtn) backupBtn.style.display = 'none';
        if (restoreBtn) restoreBtn.style.display = 'none';
        
        const element = document.querySelector('.container');
        
        // PDF 생성 전 스타일 조정
        const originalPadding = element.style.padding;
        const originalMaxWidth = element.style.maxWidth;
        const originalWidth = element.style.width;
        const originalMargin = element.style.margin;
        const originalBoxSizing = element.style.boxSizing;
        
        // A4 용지 너비: 210mm, 여백: 좌우 각 15mm
        // 사용 가능 너비: 210 - 30 = 180mm
        // 1mm ≈ 3.779527559px (96 DPI 기준)
        const a4WidthMm = 210;
        const marginLeftRight = 15 * 2; // 좌우 여백 합계
        const usableWidthMm = a4WidthMm - marginLeftRight; // 180mm
        const usableWidthPx = Math.floor(usableWidthMm * 3.779527559); // 약 680px
        
        // 컨테이너 너비 조정 (A4 용지에 맞게)
        element.style.boxSizing = 'border-box';
        element.style.padding = '20px';
        element.style.maxWidth = usableWidthPx + 'px';
        element.style.width = usableWidthPx + 'px';
        element.style.margin = '0 auto';
        
        // 약간의 지연을 주어 스타일 적용이 완료되도록
        setTimeout(() => {
            const opt = {
                margin: [15, 15, 15, 15], // 여백 균등 조정 (상, 우, 하, 좌)
                filename: '이력서.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.page-break-before',
                    after: '.page-break-after',
                    avoid: [
                        '.section', 
                        '.experience-item', 
                        '.project-item', 
                        '.education-item', 
                        '.etc-item',
                        '.article-item',
                        '.cover-letter-item',
                        '.portfolio-item',
                        '.opensource-item',
                        '.profile-section',
                        '.skill-category'
                    ]
                }
            };
            
            html2pdf().set(opt).from(element).save().then(() => {
                // 복원
                element.style.padding = originalPadding;
                element.style.maxWidth = originalMaxWidth;
                element.style.width = originalWidth;
                element.style.margin = originalMargin;
                element.style.boxSizing = originalBoxSizing;
                if (headerActions) headerActions.style.display = originalHeaderDisplay;
                if (scrollBtn) scrollBtn.style.display = originalScrollDisplay;
                if (backupBtn) backupBtn.style.display = originalBackupDisplay;
                if (restoreBtn) restoreBtn.style.display = originalRestoreDisplay;
            }).catch((error) => {
                // 에러 시에도 복원
                console.error('PDF 생성 오류:', error);
                element.style.padding = originalPadding;
                element.style.maxWidth = originalMaxWidth;
                element.style.width = originalWidth;
                element.style.margin = originalMargin;
                element.style.boxSizing = originalBoxSizing;
                if (headerActions) headerActions.style.display = originalHeaderDisplay;
                if (scrollBtn) scrollBtn.style.display = originalScrollDisplay;
                if (backupBtn) backupBtn.style.display = originalBackupDisplay;
                if (restoreBtn) restoreBtn.style.display = originalRestoreDisplay;
                alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
        }, 100); // 100ms 지연
    };
    document.head.appendChild(script);
}

// 페이지 로드 시 렌더링
document.addEventListener('DOMContentLoaded', function() {
    renderProfile();
    initScrollToTop();
});

