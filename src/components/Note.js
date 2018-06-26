import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import Swipeable from 'react-swipeable';
import styled, { keyframes } from 'styled-components';
import { Icon } from 'rmwc/Icon';
import faker from 'faker';
import moment from 'moment';
import DebouncedInput from 'react-debounce-input';
import { Fab } from 'rmwc/Fab';
import { Menu, MenuAnchor, MenuItem } from 'rmwc/Menu';
import { ListDivider, ListItemText, ListItemGraphic } from 'rmwc';
import Markdown from 'react-markdown';

export function debounce(fn, w, imm) {
  let timeout;
  return function() {
    let context = this;
    let args = arguments;
    let later = function() {
      timeout = null;
      if (!imm) fn.apply(context, args);
    }
    let callNow = imm && !timeout;
    clearTimeout(timeout);
    timeout - setTimeout(later, w)
    if (callNow) fn.apply(context, args);
  }
}

const breakpoint = '600px';

const savingAnimation = keyframes`
  from {
    transform: rotate(45deg);
  }
  to {
    transform: rotate(405deg);
  }
`;

export const SavingIcon = styled(({isSaving, ...props}) => <Icon {...props}/>)`
  animation-direction: forwards;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-duration: 1s;
  animation-name: ${props => props.isSaving ? savingAnimation : null};
  margin-left: 6px;
`;

export const NotePage = styled(Swipeable)`
  position: relative;
  height: calc(100% - 56px);
  @media screen and (min-width: ${breakpoint}) {
    height: calc(100% - 64px);
  }
`;

export const NoteTopBar = styled.div`
  position: relative;
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

`

export const NoteArea = styled(props => <DebouncedInput {...props} element="textarea"/>)`
  resize: none;
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  line-height: 1.5;
  height: calc(100% - 36px);
  box-sizing: border-box;
  padding: 6px 12px 48px;
  width: 100%;
  border: 0;
  &:focus {
    outline: 0;
    border: 0;
  }
`;

export const NoteDate = styled.p`
  color: rgba(0,0,0,0.54);
  font-size: 90%;
`

export const NoteStatusIcons = styled.div`
  color: rgba(0,0,0,0.54);
`

export const OpenMenu = styled(Fab)`
  background-color: ${ props => props.theme.secondary.base }!important;
  color: #fff!important;
  position: fixed!important;
  bottom: 12px;
  right: 12px;
`

export const PlacedMenu = styled(MenuAnchor)`
  background: transparent;
  position: fixed!important;
  bottom: 56px;
  right: 12px;
`

export const StyledMarkdown = styled(Markdown)`
  padding: 6px 12px 48px;
  font-size: 1em;
  line-height: 1.5;
  box-sizing: border-box;
`

class Note extends Component {

  state = {
    isSaving: false,
    note: faker.lorem.paragraphs(5),
    menuOpen: false,
    editing: false
  }

  componentWillMount() {
    this.props.setTitle('Note')
  }

  handleSwipeRight = (e, d, f) => {
    if (f) {
      this.props.history.go(-1);
    }
  }

  handleNoteChange = (e) => {
    e.persist();
    this.setState({
      note: e.target.value,
      isSaving: true
    }, () => {
      setTimeout(() => {
        this.setState({
          isSaving: false
        })
      }, 3000);
    })
  }

  render(){
    return(
      <NotePage
        onSwipedRight={this.handleSwipeRight}
      >
        <NoteTopBar>
          <NoteDate>
            { moment().format('ddd, D MMM. \'YY @ H:mm')}
          </NoteDate>
          <NoteStatusIcons>
            <Icon 
              onClick={e => this.setState({editing: !this.state.editing})}
              use={ this.state.editing ? 'edit' : 'remove_red_eye'}
            />
            <SavingIcon 
              isSaving={this.state.isSaving} 
              use={this.state.isSaving ? 'autorenew' : 'done'}
            />
          </NoteStatusIcons>
        </NoteTopBar>
        {
          this.state.editing
            ? <NoteArea 
                value={this.state.note}
                debounceTimeout={1000}
                onChange={this.handleNoteChange}
              />
            : <StyledMarkdown source={this.state.note}/>
        }
        <PlacedMenu element="span">
          <Menu
            open={this.state.menuOpen}
            onClose={e => this.setState({menuOpen: false})}
          >
            <MenuItem onClick={e => this.setState({editing: !this.state.editing})}>
              <ListItemGraphic use={ this.state.editing ? 'edit' : 'remove_red_eye'} />
              <ListItemText>{ this.state.editing ? 'View' : 'Edit' }</ListItemText>
            </MenuItem>
            <ListDivider/>
            <MenuItem>
              <ListItemGraphic use="delete"/>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
          <OpenMenu mini onClick={e => this.setState({menuOpen: !this.state.menuOpen})}>menu</OpenMenu>
        </PlacedMenu>
      </NotePage>
    );
  }
}

Note.propTypes = {}

export default Note;