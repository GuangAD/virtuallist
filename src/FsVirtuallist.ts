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
  state: IFsVirtuallistState; // 组件状态
  scrollStyle: object; // list 动态样式（高度，偏移）
  startIndex: number;
  endIndex: number;
  renderList: any[];
  oContainer: HTMLElement;
  oList: HTMLElement;
  /**
   * 创建一个虚拟列表
   * @param {string} containerSelector 容器选择器
   * @param {string} listSelector list 选择器
   */
  constructor(containerSelector: string, listSelector: string) {
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
    this.oContainer = document.querySelector(containerSelector)!;
    this.oList = document.querySelector(listSelector)!;
  }

  init() {
    this.state.viewHeight = this.oContainer.offsetHeight;
    this.state.maxCount =
      Math.ceil(this.state.viewHeight / this.state.itemHeight) + 1;
  }

  computedEndIndex() {
    const end = this.startIndex + this.state.maxCount;
    this.endIndex = this.state.dataSource[end]
      ? end
      : this.state.dataSource.length;
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
      height: `${
        dataSource.length * itemHeight - this.startIndex * itemHeight
      }px`,
      transform: `translate3d(0, ${this.startIndex * itemHeight}px, 0)`,
    };
  }
}
