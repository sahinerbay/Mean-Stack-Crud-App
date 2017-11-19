import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { SortAndFilterOptions } from './../../../_interfaces/sortAndFilterOptions';

/* Services */
import { HttpService } from '../../../_services/http.service';
import { GetRouteService } from '../../../_services/get-route.service';
import { SettingsService } from './../../../_services/settings.service';
import { SharedDataService } from './../../../_services/shared-data.service';
import { HelpersService } from './../../../_services/helpers.service';

@Component({
  selector: 'gt-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.scss'],
  providers: [GetRouteService, HelpersService],
  encapsulation: ViewEncapsulation.Native
})
export class ListFilterComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private routeService: GetRouteService,
    private settingService: SettingsService,
    private dataService: SharedDataService,
    private helperService: HelpersService
  ) { }

  // Retrieved from parent component list-item.component
  @Input() private numberOfResults: number;

  private sortByOptions: SortAndFilterOptions;
  private filterMediaTypeOptions: SortAndFilterOptions;

  //Selected option media type -If nothing is selected then default is image
  private currentMediaTypeOption: string;
  private currentSearchQuery: string;
  private currentSortOrder: string;

  ngOnInit() {
    // Creates filter select bar by media type
    this.filterMediaTypeOptions = this.settingService.filterMediaTypeOptions;
    // Creates sorting by 'most popular', 'newest', 'best match'
    this.sortByOptions = this.settingService.sortByOptions;

    this.routeService.getActiveRoute().subscribe(params => {
      this.currentMediaTypeOption = params.get('mediaType');
    });

    // Fetch search query from route parameter -'query' comes from get-route.service
    this.routeService.getActiveParameter().subscribe(params => {
      this.currentSearchQuery = params.get('query');
      this.currentSortOrder = params.get('sort_order');
    });

  }

  setMediaType(event): void {
    this.currentMediaTypeOption = event.target.value;
  }

  setPreviewDetails(previewCondition:boolean) {
    this.dataService.setPreviewDetails(previewCondition);
  }

  sendRequest(event, mediaType, searchQuery) {
    if (event.target.nodeName === 'SPAN' ||
      event.target.nodeName === 'BUTTON' ||
      event.keyCode === 13) {
      this.routeService.setRoutes(mediaType, searchQuery, this.currentSortOrder);
      this.httpService.getPosts(mediaType, searchQuery, this.currentSortOrder);
    }
  }

  sortByRequest(event): void {
    this.currentSortOrder = event.target.value;
    this.httpService.getPosts(this.currentMediaTypeOption, this.currentSearchQuery, event.target.value);
    this.routeService.setRoutes(this.currentMediaTypeOption, this.currentSearchQuery, this.currentSortOrder);
  }

}
