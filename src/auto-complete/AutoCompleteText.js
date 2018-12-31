import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './AutoCompleteText.css';

class AutoCompleteText extends Component {

    items = [
        'aa',
        'aaa',
        'aaa',
        'aaa',
        'aaaaaaaaaaaa'
    ];

    container = React.createRef();

    componentWillMount() {
        this.items = this.props.data;
    }

    state = {
        suggestions: [],
        text: '',
        isSuggestionHidden: true,
        selectedItemIndex: -1
    }
    ;
    resetSuggestion = () => {
        this.setState(
            {
                suggestions: [],
                isSuggestionHidden: true,
                selectedItemIndex: -1
            });
    };

    countUpSelectedIndex = () => {
        this.setState((currentState => ({selectedItemIndex: currentState.selectedItemIndex + 1})))
    };

    countDownSelectedIndex = () => {
        this.setState((currentState => ({selectedItemIndex: currentState.selectedItemIndex - 1})))
    };

     scrollToView = (index ) => {
         const container = this.container.current;
         const ul = container.querySelector('ul');
         const li = ul.querySelector('li');
         const liHeight = li.offsetHeight;
         const scrollTop = ul.scrollTop;
         const viewport = scrollTop + ul.offsetHeight;
         const scrollOffset = liHeight * index;
         console.log(scrollOffset);
         if (scrollOffset < scrollTop || (scrollOffset + liHeight) > viewport) {
             ul.scrollTop = scrollOffset;
         }
    }


    inputElKeyHandler = (evt) => {

        const value = evt.target.value;
        if (value.length === 0) {
            this.setState(() => ({
                suggestions: [],
                text: value
            }));
        } else {
            const suggestions = this.suggestionFilter(value);
            this.setState(() => ({suggestions, text: value}))
        }

        const suggestionLength = this.state.suggestions.length;
        const { selectedItemIndex } = this.state;

        switch (evt.keyCode) {
            case 27: // ESC
                this.setState({suggestions: []});
                break;

            case 38: // UP
                if (selectedItemIndex > 0) {
                    this.countDownSelectedIndex();
                   this.scrollToView(this.state.selectedItemIndex - 1);
                }
                break;

            case 40: // DOWN
                if (selectedItemIndex + 1 < suggestionLength ) {
                    this.countUpSelectedIndex();
                  this.scrollToView(this.state.selectedItemIndex + 1);
                }
                break;

            case 13: // ENTER
                if (selectedItemIndex > -1 && selectedItemIndex < suggestionLength) {
                    console.log(this.state.suggestions, this.state.selectedItemIndex);
                    this.setState({text: this.state.suggestions[this.state.selectedItemIndex]});
                    this.resetSuggestion();
                }

                break;

            case 8:
                const suggestions = this.suggestionFilter(evt.target.value);
                this.setState({suggestions});
                this.selecteItemIndex = -1;
                break;
            case 9:
                break;

            default:

        }
    }

    liDynamicClass = (i) => {
        return this.state.selectedItemIndex === i ? 'active-grey list-group-item': 'list-group-item';
    };

    renderSuggestions = () => {
        const {suggestions} = this.state;
        if (suggestions.length === 0) {
            return null;
        }


        return (
            <ul  className={'auto-complete-data-container list-group'}>
                {suggestions.map((item, i) => (
                    <li
                        key={i}
                        className={this.liDynamicClass(i)}
                        onClick={() => {
                        this.suggestionSelected(item)
                    }}>{item}</li>
                ))}
            </ul>
        )
    };

    suggestionSelected = (value) => {
        this.setState(() => (
            {
                text: value,
                suggestions: []
            }
        ));

    }

    suggestionFilter = (value) => {
        const regex = new RegExp(value, 'ig');
        return this.items.sort().filter(v => regex.test(v));
    }

    onTextChanged = (e) => {
        if(this.props.minChars >= e.target.value.length) {
            const value = e.target.value;
            if (value.length === 0) {
                this.setState(() => ({
                    suggestions: [],
                    text: value
                }));
            } else {
                const suggestions = this.suggestionFilter(value);
                this.setState(() => ({suggestions, text: value}))
            }
        }
    }



    render() {
        return (
            <div ref={this.container} className={'form-group auto-complete-container'}  style={{
                width: '300px'
            }}>
                <input
                    className={'form-control'}
                    value={this.state.text}
                    onKeyDown={this.inputElKeyHandler}
                    onChange={this.onTextChanged}
                    type="text"/>
                    {this.renderSuggestions()}
            </div>
        );
    }
}

AutoCompleteText.propTypes = {
  minChars: PropTypes.number,
  data: PropTypes.array.isRequired,
};

AutoCompleteText.defaultProps = {
    minChars: 0
};

export default AutoCompleteText;