import $ from 'jquery';
import Mn from 'backbone.marionette';
import Template from './template.hbs';
import Collection from './collection';
import ItemView from './item/view';
import ModalService from '../../modal/service';
import FlashesService from '../../flashes/service';
import session from '../../../common/session';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #add-new': 'handleAddNew'
  },
  initialize(options) {
    const { add } = options;
    this.collection = new Collection();
    this.collection.on('sync', this.render);
    this.collection.on('remove', this.render);
    this.collection.fetch();
    this.props = {};
    this.props.add = add;
  },

  onRender() {
    var element = this.$el.find('#survey-list');
    element.empty();

    this.collection.forEach(item => {
      
      item.bind('remove', function() {
        this.destroy();
      });

      let itemView = new ItemView({
        model: item,
        addSurvey: this.props.add,
        deleteSurvey: this.deleteSurvey.bind(this)
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });
    
    if (session.userHasRole('ROLE_SURVEY_USER')) {
      $('#add-new').hide();
      $('.delete-survey-btn').hide();
      $('.take-survey-btn').show();
    }else{
      $('#add-new').show();
      $('.take-survey-btn').hide();
    }
  },

  handleAddNew(e) {
    e.preventDefault();
    this.props.add();
  },

  deleteSurvey(model) {
    var self = this;
    ModalService.request('confirm', {
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete "${model.get('title')}"?`
    }).then(confirmed => {
      if (!confirmed) {
        return;
      }

      model.destroy({

        success: () => self.handleDestroySuccess(),
        error: (item, response) => {
          self.render();
          return self.handleDestroyError(response);
        },
        wait:true
        });
    });
  },

  handleDestroySuccess() {
    return FlashesService.request('add', {
      timeout: 2000,
      type: 'info',
      body: 'The survey has been deleted!'
    });
  },

  handleDestroyError(error) {
    return FlashesService.request('add', {
      timeout: 2000,
      type: 'danger',
      body: error.responseJSON? error.responseJSON.message : "Error"
    });
  }
});
