// 확장된 Menu 클래스 구현
class Menu {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.subMenus = element.querySelectorAll('.menu-sub');

    // 기본 옵션 설정
    this.animate = options.animate !== undefined ? options.animate : true;
    this.orientation = options.orientation || 'vertical';
    this.accordion = options.accordion !== undefined ? options.accordion : true;
    this.showDropdownOnHover = options.showDropdownOnHover || false;
    this.closeChildren = options.closeChildren || false;
    this._rtl = document.documentElement.getAttribute("dir") === "rtl";
    this._topParent = null;

    // 메뉴를 초기화
    this.init();
  }

  init() {
    // 서브 메뉴 숨기기
    this.subMenus.forEach((subMenu) => {
      subMenu.style.display = 'none';
    });

    // 메뉴 토글 기능 추가
    this.addToggleEvents();

    // 애니메이션 설정
    if (this.animate) {
      this.element.style.transition = 'all 0.3s ease';
    }

    // 방향 설정
    if (this.orientation === 'horizontal') {
      this.element.style.display = 'flex';
    } else {
      this.element.style.display = 'block';
    }
  }

  addToggleEvents() {
    const menuItems = this.element.querySelectorAll('.menu-item > .menu-link');

    menuItems.forEach((menuItem) => {
      menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        const subMenu = menuItem.nextElementSibling;

        if (subMenu) {
          if (subMenu.style.display === 'none' || subMenu.style.display === '') {
            this.openSubMenu(subMenu);
          } else {
            this.closeSubMenu(subMenu);
          }
        }
      });
    });
  }

  openSubMenu(subMenu) {
    subMenu.style.display = 'block';
    if (this.animate) {
      subMenu.style.height = '0px';
      setTimeout(() => {
        subMenu.style.height = `${subMenu.scrollHeight}px`;
      }, 0);
    }
    this._bindAnimationEndEvent(subMenu, () => {
      subMenu.style.height = 'auto';
    });
  }

  closeSubMenu(subMenu) {
    if (this.animate) {
      subMenu.style.height = `${subMenu.scrollHeight}px`;
      setTimeout(() => {
        subMenu.style.height = '0px';
      }, 0);
      this._bindAnimationEndEvent(subMenu, () => {
        subMenu.style.display = 'none';
      });
    } else {
      subMenu.style.display = 'none';
    }
  }

  // 메뉴에 있는 다른 열린 서브메뉴 닫기 (아코디언 효과)
  _closeOther(openedMenu) {
    const openMenus = this.element.querySelectorAll('.menu-item.open');
    openMenus.forEach((menu) => {
      if (menu !== openedMenu) {
        this.closeSubMenu(menu.querySelector('.menu-sub'));
        menu.classList.remove('open');
      }
    });
  }

  _bindAnimationEndEvent(element, callback) {
    const onAnimationEnd = (event) => {
      if (event.target === element) {
        element.removeEventListener('transitionend', onAnimationEnd);
        callback();
      }
    };
    element.addEventListener('transitionend', onAnimationEnd);
  }

  switchMenu(orientation) {
    if (orientation === 'horizontal') {
      this.element.classList.remove('menu-vertical');
      this.element.classList.add('menu-horizontal');
      this.element.style.display = 'flex';
    } else {
      this.element.classList.remove('menu-horizontal');
      this.element.classList.add('menu-vertical');
      this.element.style.display = 'block';
    }
  }

  // 메뉴 스크롤 관리
  manageScroll() {
    const innerMenu = this.element.querySelector('.menu-inner');
    if (window.innerWidth < 992) {
      innerMenu.style.overflowY = 'auto';
    } else {
      innerMenu.style.overflowY = 'visible';
    }
  }

  destroy() {
    // 모든 이벤트 핸들러 제거 및 스타일 초기화
    const menuItems = this.element.querySelectorAll('.menu-item > .menu-link');
    menuItems.forEach((menuItem) => {
      const subMenu = menuItem.nextElementSibling;
      if (subMenu) {
        menuItem.removeEventListener('click', this.toggleSubMenu);
        subMenu.style.display = '';
        subMenu.style.height = '';
      }
    });

    this.element.style.transition = '';
  }
}

export default Menu;
