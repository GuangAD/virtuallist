/**
 * @interface: 虚拟列表状态
 * @param {any[]} dataSource 数据源
 * @param {number} itemHeight 列表项高度
 * @param {number} viewHeight 容器高度
 * @param {number} maxCount 最大容纳量
 */
interface IFsVirtuallistState {
  dataSource: any[];
  itemHeight: number;
  viewHeight: number;
  maxCount: number;
}

interface IScrollStyle {
  height?: string;
  transform?: string;
}

/**
 * 
  <div class="container">
    <div class="fs-virtuallist-container">
      <div class="fs-virtuallist-list">
        <!-- <div class="fs-virtuallist-item"></div> -->
      </div>
    </div>
  </div>
 */
class FsVirtuallist {
  state: IFsVirtuallistState; // 组件数据
  scrollStyle: IScrollStyle; // list 动态样式（高度，偏移）
  startIndex: number;
  endIndex: number;
  renderList: any[];
  oContainer: HTMLElement | undefined;
  oList: HTMLElement | undefined;
  lastStartIndex: number; // 上一次渲染时的起始索引
  /**
   * 创建一个虚拟列表
   * @param {string} containerSelector 容器选择器
   * @param {string} listSelector list 选择器
   */
  constructor(containerSelector: string, listSelector: string) {
    this.lastStartIndex = -1;
    this.state = {
      dataSource: [], // 模拟数据源
      itemHeight: 100, // 固定 item 高度
      viewHeight: 0, // container 高度
      maxCount: 0, // 虚拟列表视图最大容纳量
    };
    this.scrollStyle = {}; // list 动态样式（高度，偏移）
    this.startIndex = 0; // 当前视图列表在数据源中的起始索引
    this.endIndex = 0; // 当前视图列表在数据源中的末尾索引
    this.renderList = []; // 渲染在视图上的列表项
    // 根据用户传入的选择器获取 DOM 并保存
    const oContainer: HTMLElement | null =
      document.querySelector(containerSelector);
    const oList: HTMLElement | null = document.querySelector(listSelector);
    if (!oContainer || !oList) {
      console.error("未找到容器或列表");
      return;
    } else {
      this.oContainer = oContainer;
      this.oList = oList;
    }
  }

  init() {
    this.state.viewHeight = this.oContainer!.offsetHeight;
    this.state.maxCount =
      Math.ceil(this.state.viewHeight / this.state.itemHeight) + 1;

    this.bindEvent();
    this.addData();
    this.render();
  }

  computedEndIndex() {
    const end = this.startIndex + this.state.maxCount;
    this.endIndex = this.state.dataSource[end]
      ? end
      : this.state.dataSource.length;

    if (this.endIndex >= this.state.dataSource.length) {
      this.addData();
    }
  }

  computedRenderList() {
    this.renderList = this.state.dataSource.slice(
      this.startIndex,
      this.endIndex
    );
  }

  computedScrollStyle() {
    const { dataSource, itemHeight } = this.state;
    this.scrollStyle = {
      height: `${(dataSource.length - this.startIndex) * itemHeight}px`,
      transform: `translate3d(0, ${this.startIndex * itemHeight}px, 0)`,
    };
  }

  render() {
    this.computedEndIndex();
    this.computedRenderList();
    this.computedScrollStyle();
    const template = this.renderList
      .map((i) => `<div class="fs-virtuallist-item">${i}</div>`)
      .join("");
    const { height, transform } = this.scrollStyle;
    this.oList!.innerHTML = template;
    this.oList!.style.height = height!;
    this.oList!.style.transform = transform!;
  }

  bindEvent() {
    // 注意需要改变 this 指向 -> bind
    this.oContainer!.addEventListener(
      "scroll",
      this.rafThrottle(this.handleScroll.bind(this))
    );
  }

  rafThrottle(fn: Function) {
    let lock = false;
    return function (...args: any[]) {
      window.requestAnimationFrame(() => {
        if (lock) return;
        lock = true;
        fn.apply(undefined, args);
        lock = false;
      });
    };
  }

  handleScroll() {
    const { scrollTop } = this.oContainer!;
    this.startIndex = Math.floor(scrollTop / this.state.itemHeight);
    if (this.startIndex !== this.lastStartIndex) {
      this.lastStartIndex = this.startIndex;
      this.render();
    }
  }

  addData() {
    for (let i = 0; i < 10; i++) {
      this.state.dataSource.push(this.state.dataSource.length + 1);
    }
  }
}

export default FsVirtuallist;
