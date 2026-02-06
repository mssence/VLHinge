import { MOCK_PROFILES } from './data.js';

class HingeClone {
    constructor() {
        this.currentProfileIndex = 0;
        this.mainContent = document.getElementById('main-content');
        this.navItems = document.querySelectorAll('.nav-item');

        this.init();
    }

    init() {
        this.renderDiscovery();
        this.setupNav();
    }

    setupNav() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.updateNav(e.currentTarget);
                this.handleViewChange(view);
            });
        });
    }

    updateNav(activeItem) {
        this.navItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }

    handleViewChange(view) {
        this.mainContent.innerHTML = '';
        if (view === 'discovery') {
            this.renderDiscovery();
        } else {
            this.mainContent.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                    <i class='bx bx-ghost' style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>Coming Soon: ${view.charAt(0).toUpperCase() + view.slice(1)}</p>
                </div>
            `;
        }
    }

    renderDiscovery() {
        const profile = MOCK_PROFILES[this.currentProfileIndex];
        if (!profile) {
            this.mainContent.innerHTML = `<div class="discovery-card"><h2>No more profiles found!</h2></div>`;
            return;
        }

        const container = document.createElement('div');
        container.className = 'discovery-card';

        // Profile Header
        const header = document.createElement('div');
        header.className = 'profile-header';
        header.innerHTML = `
            <h1 class="profile-name">${profile.name}</h1>
            <div class="profile-pills">
                <span class="profile-info-pill">${profile.age}</span>
                <span class="profile-info-pill">${profile.job}</span>
                <span class="profile-info-pill">${profile.location}</span>
            </div>
        `;
        container.appendChild(header);

        // Core Content (Photos and Prompts)
        profile.elements.forEach(element => {
            const section = document.createElement('div');
            section.className = 'profile-section';

            if (element.type === 'photo') {
                section.innerHTML = `
                    <div class="photo-container">
                        <img src="${element.url}" alt="${profile.name}">
                        <button class="like-trigger" data-type="photo">
                            <i class='bx bx-heart'></i>
                        </button>
                    </div>
                `;
            } else if (element.type === 'prompt') {
                section.innerHTML = `
                    <div class="prompt-container">
                        <div class="prompt-question">${element.question}</div>
                        <div class="prompt-answer">${element.answer}</div>
                        <button class="like-trigger" data-type="prompt">
                            <i class='bx bx-heart'></i>
                        </button>
                    </div>
                `;
            }
            container.appendChild(section);
        });

        // Add Discard/Skip Area
        const skipBtn = document.createElement('button');
        skipBtn.innerHTML = "<i class='bx bx-x'></i>";
        skipBtn.style.cssText = "margin: 40px auto; width: 60px; height: 60px; border-radius: 50%; border: 1px solid var(--border-light); background: white; font-size: 30px; color: var(--text-muted); cursor: pointer;";
        skipBtn.onclick = () => this.nextProfile();
        container.appendChild(skipBtn);

        this.mainContent.appendChild(container);
        this.mainContent.scrollTop = 0;

        this.attachInteractions();
    }

    attachInteractions() {
        const hearts = this.mainContent.querySelectorAll('.like-trigger');
        hearts.forEach(heart => {
            heart.onclick = (e) => {
                e.stopPropagation();
                this.showLikeFlow();
            };
        });
    }

    showLikeFlow() {
        const overlay = document.getElementById('overlay-container');
        overlay.innerHTML = `
            <div class="like-modal-backdrop">
                <div class="like-modal">
                    <h3 class="serif">Send a like</h3>
                    <p>Add a comment to start the conversation</p>
                    <textarea placeholder="Write something..."></textarea>
                    <div class="modal-actions">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-send">Send Like</button>
                    </div>
                </div>
            </div>
        `;

        overlay.querySelector('.btn-cancel').onclick = () => {
            overlay.innerHTML = '';
        };

        overlay.querySelector('.btn-send').onclick = () => {
            this.sendLike();
        };
    }

    sendLike() {
        const overlay = document.getElementById('overlay-container');
        overlay.innerHTML = `
            <div class="success-toast">
                <i class='bx bx-check-circle'></i> Sent!
            </div>
        `;
        setTimeout(() => {
            overlay.innerHTML = '';
            this.nextProfile();
        }, 1500);
    }

    nextProfile() {
        this.currentProfileIndex = (this.currentProfileIndex + 1) % MOCK_PROFILES.length;
        this.mainContent.innerHTML = '';
        this.renderDiscovery();
    }
}

// Add CSS for Modal and Toast dynamically or in styles.css
const style = document.createElement('style');
style.textContent = \`
    .like-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: flex-end;
        z-index: 1000;
    }
    .like-modal {
        width: 100%;
        background: white;
        border-radius: 20px 20px 0 0;
        padding: 32px 24px;
        animation: slideUp 0.3s ease-out;
    }
    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }
    .like-modal h3 { font-size: 24px; margin-bottom: 8px; }
    .like-modal p { color: var(--text-muted); font-size: 14px; margin-bottom: 20px; }
    .like-modal textarea {
        width: 100%;
        height: 120px;
        padding: 16px;
        border: 1px solid var(--border-light);
        border-radius: 12px;
        font-family: inherit;
        font-size: 16px;
        margin-bottom: 24px;
        outline: none;
    }
    .modal-actions { display: flex; gap: 12px; }
    .modal-actions button {
        flex: 1;
        padding: 16px;
        border-radius: 30px;
        border: none;
        font-weight: 600;
        cursor: pointer;
    }
    .btn-cancel { background: #F0f0f0; color: var(--text-dark); }
    .btn-send { background: var(--primary-black); color: white; }
    
    .success-toast {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 40px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        animation: fadeInUp 0.3s ease;
        z-index: 2000;
    }
\`;
document.head.appendChild(style);

new HingeClone();
