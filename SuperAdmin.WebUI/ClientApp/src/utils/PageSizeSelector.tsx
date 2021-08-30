import React from "react";
import { SplitButton, MenuItem, DropdownButton, ButtonToolbar } from "react-bootstrap";

export default class PageSizeSelector extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            sizeList: [5, 10, 20, 50, 100]
        }
    }
    render() {
        return (
            <div  className={this.props.classNames} >
                
                 <span className="under-dd">Rows</span>
                 <span>
                 <DropdownButton  
                    pullRight
                    bsSize="xsmall"
                    title={this.props.selectedPage}
                    id="page-size-dd"
                    className={"mr-20"}
                    
                > {this.state.sizeList.map((item: number) =>
                    <MenuItem eventKey={item} key={item} onSelect={() => this.props.changePageSize(item)}>{item}</MenuItem>)

                    }
                </DropdownButton>
                 </span>
                
  
              

            </div>
        );
    }
}