import React, { Component } from "react";
import { DropdownButton, MenuItem, SplitButton } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
class DropdownToolTip extends Component {
    constructor(props) {
        super(props);

    }

    /** TootltipID should be unique: we are using the convention ParentMenu-ChildMenu-DrodpownLabelName */


    render() {
        let {menuItemIdkey, menuItemIdName} = this.props;
        return (
            <span>
            <label>{this.props.label}{this.props.required==true? <span className="error">*</span>:<span></span>}</label>
            <span className="custom-dropdown" >
                
                <SplitButton
                    title={this.props.title}
                    disabled={this.props.disabled}
                    id={this.props.id}         
                    data-tip 
                    data-for={this.props.tooltipID}   
                    className={this.props.className}
                    
                >
                    {this.props.canResetSelectedOption?
                        <MenuItem eventKey='-1' onSelect={() => this.props.onSelectOption({[menuItemIdkey]: this.props.resetId, [menuItemIdName]: this.props.resetValue})}>{this.props.resetValue}</MenuItem> :''
                    }
                    {this.props.list && this.props.list.length > 0 ?
                        this.props.list.map((obj) =>
                            <MenuItem eventKey={obj[menuItemIdkey]} key={obj[menuItemIdkey]} onSelect={() => this.props.onSelectOption(obj)} className={this.props.canDisableOptions && this.props.disableOptionFunc(obj) ? "optionDisable" : ''} disabled = {this.props.canDisableOptions? this.props.disableOptionFunc(obj):false}>{obj[menuItemIdName]}</MenuItem>) :
                    <MenuItem eventKey={-1} key={-1} onSelect={() => { }}>{this.props.defaultOption? this.props.defaultOption: 'Loading...'}</MenuItem>
                    }
                </SplitButton>
                <ReactTooltip id={this.props.tooltipID} effect='solid' place={this.props.direction? this.props.direction: 'top'}>
                    <span>{this.props.title}</span>
                </ReactTooltip>
            </span>
            </span>

        );
    }
}

export default DropdownToolTip;
