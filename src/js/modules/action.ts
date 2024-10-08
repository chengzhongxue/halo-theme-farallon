class farallonAction extends farallonBase {
    like_btn: any;
    selctor: string = '.like-btn';
    post_id: number = 0;
    constructor() {
        super();
        //@ts-ignore
        this.post_id = obvInit.post_id;
        this.like_btn = document.querySelector(this.selctor);
        if (this.like_btn) {
            this.like_btn.addEventListener('click', () => {
                this.handleLike();
            });
            if (this.getCookie('like_' + this.post_id)) {
                this.like_btn.classList.add('is-active');
            }
        }
        const theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'auto';
        const html = `<div class="fixed--theme">
        <span class="${theme == 'dark' ? 'is-active' : ''}" data-action-value="dark">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
        </span>
        <span class="${theme == 'light' ? 'is-active' : ''}" data-action-value="light">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2"></path>
                <path d="M12 21v2"></path>
                <path d="M4.22 4.22l1.42 1.42"></path>
                <path d="M18.36 18.36l1.42 1.42"></path>
                <path d="M1 12h2"></path>
                <path d="M21 12h2"></path>
                <path d="M4.22 19.78l1.42-1.42"></path>
                <path d="M18.36 5.64l1.42-1.42"></path>
            </svg>
        </span>
        <span class="${theme == 'auto' ? 'is-active' : ''}"  data-action-value="auto">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
            </svg>
        </span>
    </div>`;
        if (this.darkmode) {
            document.querySelector('body')!.insertAdjacentHTML('beforeend', html);
        }

        document.querySelectorAll('.fixed--theme span').forEach((item) => {
            item.addEventListener('click', () => {
                if (item.classList.contains('is-active')) return;
                document.querySelectorAll('.fixed--theme span').forEach((item) => {
                    item.classList.remove('is-active');
                });
                // @ts-ignore
                if (item.dataset.actionValue == 'dark') {
                    const root = document.documentElement;
                    localStorage.setItem('theme', 'dark');
                    document.querySelector('body')!.classList.remove('auto');
                    document.querySelector('body')!.classList.add('dark');
                    root.setAttribute("theme", 'dark');
                    item.classList.add('is-active');
                    //this.showNotice('夜间模式已开启');
                    // @ts-ignore
                } else if (item.dataset.actionValue == 'light') {
                    const root = document.documentElement;
                    localStorage.setItem('theme', 'light');
                    document.querySelector('body')!.classList.remove('auto');
                    document.querySelector('body')!.classList.remove('dark');
                    root.setAttribute("theme", 'light');
                    item.classList.add('is-active');
                    //this.showNotice('夜间模式已关闭');
                    // @ts-ignore
                } else if (item.dataset.actionValue == 'auto') {
                    const root = document.documentElement;
                    localStorage.setItem('theme', 'auto');
                    document.querySelector('body')!.classList.remove('dark');
                    document.querySelector('body')!.classList.add('auto');
                    root.removeAttribute("theme");
                    item.classList.add('is-active');
                    //this.showNotice('夜间模式已关闭');
                }
            });
        });

        if (document.querySelector('.post--share')) {
            document.querySelector('.post--share')!.addEventListener('click', () => {
                navigator.clipboard.writeText(document.location.href).then(() => {
                    this.showNotice('复制成功');
                });
            });
        }

        console.log(`theme version: ${this.VERSION} init success!`);

        const copyright = `<div class="site--footer__info">
        Theme <a href="https://github.com/chengzhongxue/halo-theme-farallon" target="_blank">farallon</a> by 困困鱼 / version ${this.VERSION}
    </div>`;

        document.querySelector('.site--footer__content')!.insertAdjacentHTML('afterend', copyright);

        document.querySelector('.icon--copryrights')!.addEventListener('click', () => {
            document.querySelector('.site--footer__info')!.classList.toggle('active');
        });
    }

    handleLike() {
        // @ts-ignore
        if (this.getCookie('like_' + this.post_id)) {
            return this.showNotice('You have already liked this post');
        }
        // @ts-ignore
        const url ='/apis/api.halo.run/v1alpha1/trackers/upvote';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                // @ts-ignore
                group: "content.halo.run",
                plural: "posts",
                name: this.post_id,
            }),
            headers: {
                'Content-Type': "application/json; charset=utf-8",
            },
        }).then((response) => {
                this.showNotice('Thanks for your like');
                // @ts-ignore
                this.setCookie('like_' + this.post_id, '1', 1);
            });
        this.like_btn.classList.add('is-active');
    }

    refresh() {}
}

new farallonAction();
