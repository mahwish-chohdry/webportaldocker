import React from "react";
import PropTypes from "prop-types";

const defaultButton = (props: any) => <button {...props}>{props.children}</button>;

export default class Pagination extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.changePage = this.changePage.bind(this);

    this.state = {
      visiblePages: this.getVisiblePages(null, props.pages)
    };
  }

  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    PageButtonComponent: PropTypes.any,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string,
    data: PropTypes.any
  };

  componentWillReceiveProps(nextProps: any) {
    if (this.props.pages !== nextProps.pages) {
      this.setState({
        visiblePages: this.getVisiblePages(null, nextProps.pages)
      });
    }

    this.changePage(nextProps.page + 1);
  }

  filterPages = (visiblePages: any, totalPages: any) => {
    return visiblePages.filter((page: any) => page <= totalPages);
  };

  getVisiblePages = (page: any, total: any) => {
    if (total < 4) {
      return this.filterPages([1, 2, 3], total);
    } 
    else {
      if (page % 5 >= 0 && page >= 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1];

      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, total];
      }
    }
  };

  changePage(page: any) {
    const activePage = this.props.page + 1;

    if (page === activePage) {
      return;
    }

    const visiblePages = this.getVisiblePages(page, this.props.pages);

    this.setState({
      visiblePages: this.filterPages(visiblePages, this.props.pages)
    });

    this.props.onPageChange(page - 1);
  }

  render() {
    const { PageButtonComponent = defaultButton } = this.props;
    const { visiblePages } = this.state;
    const activePage = this.props.page + 1;

    return (
      <div>
        <div className="Table__pagination">
          <div className="Table__prevPageWrapper">
            <PageButtonComponent
              className="Table__pageButton"
              onClick={() => {
                if (activePage === 1) return;
                this.changePage(activePage - 1);
              }}
              disabled={activePage === 1}
            >
              <i className="fa fa-angle-left fa-xs"></i>  {"Prev"}
              
            </PageButtonComponent>
          </div>
          <div className="Table__visiblePagesWrapper">
            {visiblePages.map((page: any, index: any, array: any) => {
              return (

                <span key={page}>
                  {array[index - 1] + 2 < page ?
                    <span>...</span> :
                    <PageButtonComponent
                      key={page}
                      className={
                        activePage === page
                          ? "Table__pageButton Table__pageButton--active"
                          : "Table__pageButton"
                      }
                      onClick={this.changePage.bind(null, page)}
                    >
                      {page}
                    </PageButtonComponent>}
                </span>

              );
            })}
          </div>
          <div className="Table__nextPageWrapper">
            <PageButtonComponent
              className="Table__pageButton"
              onClick={() => {
                if (activePage === this.props.pages) return;
                this.changePage(activePage + 1);
              }}
              disabled={activePage === this.props.pages}
            >
              {"Next"} <i className="fa fa-angle-right fa-xs"></i>
            </PageButtonComponent>
          </div>
        </div>

        <div className="totalCount">Total Results: {this.props.totalCount? this.props.totalCount: this.props.data.length}</div>

           
      </div>

    );
  }
}