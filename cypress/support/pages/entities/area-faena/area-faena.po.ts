import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AreaFaenaComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-area-faena';
}

export class AreaFaenaUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-area-faena-update';
}

export class AreaFaenaDetailPage extends EntityDetailPage {
  pageSelector = 'page-area-faena-detail';
}
