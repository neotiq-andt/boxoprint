import React, {Component} from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import {Button, Grid, Segment, Icon, Form} from 'semantic-ui-react'
import arrayMove from 'array-move'
import UiRangeZoom from './UiRangeZoom'
import ModalConfirm from './ModalConfirm'
import ThreeSceneBoxView from '../threejs/ThreeSceneBoxView'
import ModalLogin from './ModalLogin'
import ModalCreateUserBox from '../components/ModalCreateUserBox'

let g_self = null;

function customStyle(value) {
  if (g_self.props.selectLayerIndex === value.index - 1)
    return {cursor:'pointer',textDecoration:'underline',fontWeight:'bold'};
  return {cursor:'pointer'};
};

function customRowStyle(value) {
  if (g_self.props.selectLayerIndex === value.index - 1)
    return {paddingBottom:'0.3rem',margin: '0 14px',paddingTop:'0.4rem',backgroundColor:'#eaf5ff'};
  return {paddingBottom:'0.3rem',paddingTop:'0.4rem'};
};

function printProperties(properties) {
  if (properties && (properties.l && properties.w && properties.h))
    return " " + properties.l + " x " + properties.w + " x " + properties.h;
  return "";
}

function parseQuery(search) {
    const args = search.substring(search.indexOf('?')+1).replace('+',' ').split('&');
    let argsParsed = {}, i, arg, kvp, key, value;
    for (i=0; i < args.length; i++) {
        arg = args[i];
        if (-1 === arg.indexOf('=')) {
            argsParsed[decodeURIComponent(arg).trim()] = true;
        }
        else {
            kvp = arg.split('=');
            key = decodeURIComponent(kvp[0]).trim();
            value = decodeURIComponent(kvp[1]).trim();
            argsParsed[key] = value;
        }
    }

    return argsParsed;
}

const SortableItem = SortableElement(({value, warningElement}) => {
  let item, warningOption = false;
  if (value.index === 0){
      const boxParamInfo = parseQuery(window.location.search);
      item = {layer_name:"modèle de base"};
      if(Object.keys(boxParamInfo).length)
          item = {...item,...{layer_name:boxParamInfo.productName}};
  }
  else
    item = value.items[value.index - 1];
    warningOption = warningElement.includes(item.layer_name);
    if(warningOption){
        return (
            <Grid.Row className="layer_row layer_warning_row" title={'Warning this elements out of the box'} style={customRowStyle(value)}>
                {g_self.state.movingIndex !== value.index ?
                    <Grid.Column>
                        {item.layer_type === undefined && <Icon name='puzzle piece' /> }
                        {item.layer_type === 'text' && <Icon name='text cursor' /> }
                        {item.layer_type === 'picture' && <Icon name='picture' /> }
                    </Grid.Column>
                    : null}
                <Grid.Column floated='left' width={value.index > 0 ? 10 : 14} onClick={()=>{g_self.props.onSelectLayer(item.layer_name)}}>
                    <div style={customStyle(value)}>
                        <Icon name='warning sign' /> {value.index === 0 ? item.layer_name + printProperties(value.baseProperties) : item.layer_name}
                    </div>
                </Grid.Column>
                {value.index > 0 && g_self.state.movingIndex !== value.index ?
                    <Grid.Column floated='right'>
                        <Button.Group basic size='mini' floated='right' width={1}>
                            <Button icon='edit' onClick={()=>{g_self.props.onSelectLayer(item.layer_name);g_self.props.handleEditLayer(value.index - 1)}}/>
                            <Button icon='remove' onClick={()=>{g_self.setState({modalConfirm:value.index})}}/>
                        </Button.Group>
                    </Grid.Column>
                    : null }
            </Grid.Row>
        )
    }
    return (
        <Grid.Row className="layer_row" style={customRowStyle(value)}>
            {g_self.state.movingIndex !== value.index ?
              <Grid.Column>
                {item.layer_type === undefined && <Icon name='puzzle piece' /> }
                {item.layer_type === 'text' && <Icon name='text cursor' /> }
                {item.layer_type === 'picture' && <Icon name='picture' /> }
              </Grid.Column>
            : null}
            <Grid.Column floated='left' width={value.index > 0 ? 10 : 14} onClick={()=>{g_self.props.onSelectLayer(item.layer_name)}}>
              <div style={customStyle(value)}>
                {value.index === 0 ? item.layer_name + printProperties(value.baseProperties) : item.layer_name}
              </div>
            </Grid.Column>
            {value.index > 0 && g_self.state.movingIndex !== value.index ?
              <Grid.Column floated='right'>
                <Button.Group basic size='mini' floated='right' width={1}>
                  <Button icon='edit' onClick={()=>{g_self.props.onSelectLayer(item.layer_name);g_self.props.handleEditLayer(value.index - 1)}}/>
                  <Button icon='remove' onClick={()=>{console.log(value,'value');g_self.setState({modalConfirm:value.index})}}/>
                </Button.Group>
              </Grid.Column>
            : null }
        </Grid.Row>
    )
});

const SortableList = SortableContainer(({items,baseProperties,warningElement}) => {
  return (
    <Grid className={'stackable-couches'} stackable>
      <SortableItem key={'modèle de base'} warningElement={warningElement} index={0} value={{index:0,items:items,baseProperties:baseProperties}}/>
    </Grid>
  );
});

export default class LayerBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
          movingIndex: -1,
          modalConfirm:0,
          modalLogin:0,
          modalUpdateOpen: false,
          modalCreateUser: 0,
          is3D: false,
          designName: props.project.name_project || "",
          svg: props.project.base.svg,
          result: false,
          modal: false,
          formKey: '',
          loginUrl: '',
          registerUrl: '',
          currentUser:{firstName:'', lastName:'', password:'', passwordConfirm:''},
          productId: '',
      }
  }
    
  componentDidMount() {
    setTimeout( ()=> {this.setState({is3D:true})}, 200);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.createUserResult !== this.props.createUserResult)
      if(nextProps.createUserResult.error) this.setState({modalCreateUser: 1});

    if(nextProps.loginResult !== this.props.loginResult)
      if(nextProps.loginResult.error) this.setState({modalLogin:1});
  }

  onSortStart = (node) => {
      this.setState({movingIndex: node.index});
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({movingIndex: -1});
    if (oldIndex > 0 && newIndex > 0) {
      this.props.onResult(arrayMove(this.props.layers, oldIndex - 1, newIndex - 1));
      this.props.onSelectLayer(this.props.layers[newIndex - 1].layer_name);
    }
  };

  handleCloseConfirme = (e, confirm) => {
    if (confirm === true)
      this.props.handleDeleteLayer(this.state.modalConfirm - 1);
      this.setState({modalConfirm:0});
  }

  handleModalLogin = (e, confirm, modalLoginResult) => {
    if (confirm === false){
      this.setState({modalLogin:0});
    }
    else {
      this.setState({modalLogin:1});
      this.props.handleLogin(modalLoginResult);
    }
  }
  
  handleCloseCreateUser = (e, confirm) => {
    if (confirm)
      this.setState({modalLogin:0, modalCreateUser:1});
    else 
      this.setState({modalLogin:1, modalCreateUser:0});
  }

  modalCreateUserResult = (userInfo) => {
    if (userInfo != null) 
        this.props.handleCreateUser(userInfo);
    else
      this.setState({ modalCreateUser:0});
  };

  display_zoom = ()=> {
      const rabats = [];
      rabats.push(<Form.Field key={Math.random()}>
          <UiRangeZoom defaultValue={0} onChange={this.handleChangeRangeZoom()}></UiRangeZoom>
      </Form.Field>);
      return rabats;
  }

  handleChangeRangeZoom = ()=> (value) => {
    this.props.handleZoomIn(value);
  }
  /**
   * close iframe
   */
  closeIframe = () =>{
      window.top.postMessage('closeIframe', '*');
  }

  handleOnChangeName = (event)=> {
      this.setState({designName:event.target.value});
  }

  switchRender = (event)=> {
      this.setState({designName:event.target.value});
      this.props.handleEditLayer(-1);
      this.props.handleBrush(false, '');
  }

  modalResult = (r) => {
    this.setState({modal:false});
    this.props.modalResult(r);
  };

  handleOnSave = async (project) => {
    if(project.customer_email == null || project.customer_email === '')
      this.setState({modalLogin:1});
    else
      await this.props.handleSave();
  }

  render() {
    g_self = this;
    const { warningElement=[], loginResult, boxParamInfo, createUserResult} = this.props;
    const {is3D , designName} = this.state;
    return (
      <div>
        {(this.state.modalConfirm > 0 && <ModalConfirm label={this.props.layers[this.state.modalConfirm - 1].layer_name} handleCloseConfirme={this.handleCloseConfirme}/>)}
        {(this.state.modalLogin > 0 &&  <ModalLogin handleModalLogin={this.handleModalLogin} handleCloseCreateUser={this.handleCloseCreateUser} key={loginResult}  loginResult = {loginResult} />)}
        {this.state.modalCreateUser > 0 ? <ModalCreateUserBox value={this.state.currentUser} createUserResult={createUserResult} onResult={this.modalCreateUserResult} /> : null}
          <Segment basic style={{width:'100%',padding: '0px', height:'100%', margin:"auto", marginTop:"15px"}} onClick={this.switchRender.bind(this)}>
              <ThreeSceneBoxView
                  selectedLayer={this.props.selectedLayer}
                  onBrush={this.props.onBrush}
                  onSelectLayer={this.props.onSelectLayer}
                  config={this.props.config}
                  brush={this.props.brush}
                  user_config={this.props.user_config}
                  is3D={is3D}
                  w='100%'
                  h='600px'
                  on2D={this.props.on2D}
                  on3D={this.props.on3D}
                  isControlled={true}
                  size={this.props.size}
                  svg={this.props.svg}/>
          </Segment>
          <Segment basic style={{width:'100%',height:'100%'}} color='blue'>
              <Grid className={'stackable-couches'} stackable>
                  <Grid.Row className="layer_row" style={{paddingBottom: '0.3rem', paddingTop: '0.4rem'}}>
                          <Grid.Column>
                              <Icon name='tag' />
                          </Grid.Column>
                      <Grid.Column floated='left'>
                          <div style={{whiteSpace: 'nowrap'}}>
                              {boxParamInfo.designName}
                          </div>
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </Segment>
          <Segment basic style={{width:'100%',height:'100%'}} color='blue'>
              <SortableList warningElement={warningElement} pressDelay={150} basic baseProperties={this.props.baseProperties} items={this.props.layers} onSortEnd={this.onSortEnd} updateBeforeSortStart={this.onSortStart}/>
          </Segment>
          <Segment basic style={{width:'100%',height:'100%'}} color='blue'>
          <Grid className={'stackable-couches'} stackable>
            <Grid.Row className="layer_row" style={{paddingBottom: '0.3rem', paddingTop: '0.4rem'}}>
              <Grid.Column floated='left'>
                <div style={{whiteSpace: 'nowrap'}}>
                  Prix : {Number(this.props.project.price).toFixed(2)} €
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Segment>
          <Segment  as='h5' style={{textAlign: 'center'}} vertical={true}>
              <Button primary style={{background:'#6ebe45',borderRadius: '1.285714rem'}} onClick={this.closeIframe} >Annuler</Button>
              <Button primary style={{background:'#6ebe45',borderRadius: '1.285714rem', margin: '10px'}} onClick={()=>{ this.handleOnSave(this.props.project)}}>Enregistrer</Button>
              <Button primary style={{background:'#6ebe45',borderRadius: '1.285714rem', margin: '10px'}} onClick={async ()=>{await this.props.handleAddToCard(designName);}}>Ajouter au panier</Button>
          </Segment>
      </div>
    );
  }
};
