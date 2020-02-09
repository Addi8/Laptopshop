import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { Laptop } from '../laptop';
import data from '../../assets/dummyData.json';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import * as $ from 'jquery/dist/jquery.min.js';
import { WebsocketService } from '../websocket.service';
import { ConsoleReporter } from 'jasmine';

declare const callme: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // dummyData = <any>data;
  state = '';
  laptops: any[] = [];
  filteredReviewsData: any = [];
  reviewAttributes: any = [];
  attributes: any[] = [];
  arr: any[];
  displayedColumns: string[] = ['image', 'name', 'price', 'feedbackCondition', 'review'];
  dataSource: MatTableDataSource<Laptop>;
  reviewsMap = {
    price : 'Price',
    processorManufacturer : 'Performance',
    screenSize : 'Screen',
    processorCount : 'Performance',
    processorSpeed : 'Performance',
    hardDriveType : 'Performance',
    hardDriveSize : 'Performance',
    operatingSystem : 'Performance',
    ram: 'Performance',
    itemWeight : 'Design',
    averageBatteryLife : 'Battery Life'
    };
  hideFeedback = true;
  hideReviews = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortingOptions: string[] = [
    'Relevance (default)',
    'Price (asc)',
    'Price (desc)',
    'Star Rating'
  ];

  brands = [
    { id: 'acer', name: 'Acer' },
    { id: 'apple', name: 'Apple' },
    { id: 'dell', name: 'Dell' },
    { id: 'asus', name: 'Asus' },
    { id: 'fujitsu', name: 'Fujitsu' },
    { id: 'hp', name: 'HP' },
    { id: 'huawei', name: 'Huawei' },
    { id: 'lenovo', name: 'Lenovo' },
    { id: 'medion', name: 'Medion' },
    { id: 'msi', name: 'MSI' },
    { id: 'razer', name: 'Razer' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'sony', name: 'Sony' },
    { id: 'toshiba', name: 'Toshiba' }
  ];

  prices = [
    { id: { maxValue: 200 }, name: '< 200 €' },
    { id: { minValue: 200, maxValue: 400 }, name: '200 - 400 €' },
    { id: { minValue: 400, maxValue: 600 }, name: '400 - 600 €' },
    { id: { minValue: 600, maxValue: 800 }, name: '600 - 800 €' },
    { id: { minValue: 800, maxValue: 1000 }, name: '800 - 1000 €' },
    { id: { minValue: 1000 }, name: '> 1000 €' }
  ];

  ratings = [
    { id: { minValue: 4, maxValue: 5 }, name: '4 Stars and more' },
    { id: { minValue: 3, maxValue: 5 }, name: '3 Stars and more' },
    { id: { minValue: 2, maxValue: 5 }, name: '2 Stars and more' },
    { id: { minValue: 1, maxValue: 5 }, name: '1 Star and more' }
  ];

  processorManufacturers = [
    { id: 'amd', name: 'AMD' },
    { id: 'intel', name: 'Intel' }
  ];

  screenSizes = [
    { id: { maxValue: 10 }, name: '< 25 cm (10\'\')' },
    { id: { minValue: 11, maxValue: 12 }, name: '28 - 30 cm (11\'\'-12\'\')' },
    { id: { minValue: 13, maxValue: 14 }, name: '33 - 36 cm (13\'\'-14\'\')' },
    { id: { minValue: 15, maxValue: 16 }, name: '38 - 41 cm (15\'\'-16\'\')' },
    { id: { minValue: 17 }, name: '> 43 cm (17\'\')' }
  ];

  processorCores = [
    { id: 2, name: '2 Cores' },
    { id: 4, name: '4 Cores' },
    { id: 6, name: '6 Cores' },
    { id: 8, name: '8 Cores' }
  ];

  processorSpeeds = [
    { id: { maxValue: 1.5 }, name: '< 1.5 GHz' },
    { id: { minValue: 1.5, maxValue: 1.9 }, name: '1.5 - 1.9 GHZ' },
    { id: { minValue: 2, maxValue: 2.9 }, name: '2 - 2.9 GHz' },
    { id: { minValue: 3 }, name: '> 3 GHz' }
  ];

  hardDriveTypes = [
    { id: 'hdd', name: 'HDD' },
    { id: 'ssd', name: 'SSD' },
    { id: 'hybrid', name: 'Hybrid' }
  ];

  hardDriveSizes = [
    { id: { maxValue: 128 }, name: '< 128 GB' },
    { id: { minValue: 128, maxValue: 256 }, name: '128 - 256 GB' },
    { id: { minValue: 256, maxValue: 512 }, name: '256 - 512 GB' },
    { id: { minValue: 512, maxValue: 1000 }, name: '512 - 1 TB' },
    { id: { minValue: 1000, maxValue: 2000 }, name: '1 - 2 TB' }
  ];

  operatingSystems = [
    { id: 'windows', name: 'Windows' },
    { id: 'mac os', name: 'MacOS' },
    { id: 'linux', name: 'Linux' }
  ];

  ramOptions = [
    { id: 2, name: '2 GB' },
    { id: 4, name: '4 GB' },
    { id: 6, name: '6 GB' },
    { id: 8, name: '8 GB' },
    { id: 12, name: '12 GB' },
    { id: 16, name: '16 GB' },
    { id: 24, name: '24 GB' },
    { id: 32, name: '32 GB' }
  ];

  weights = [
    { id: { maxValue: 1 }, name: '< 1 kg' },
    { id: { minValue: 1, maxValue: 1.5 }, name: '1 - 1.5 kg' },
    { id: { minValue: 1.5, maxValue: 2 }, name: '1.5 - 2 kg' },
    { id: { minValue: 2, maxValue: 2.5 }, name: '2 - 2.5 kg' },
    { id: { minValue: 2.5 }, name: '> 2.5 kg' }
  ];

  widgetForm = this.fb.group({
    brandName: this.fb.group({
      brandNameValue: this.fb.array([]),
      weight: [1]
    }),
    price: this.fb.group({
      priceRange: this.fb.array([]),
      weight: [1],
      review: false
    }),
    avgRating: this.fb.group({
      avgRatingRange: this.fb.array([]),
      weight: [1]
    }),
    processorManufacturer: this.fb.group({
      processorManufacturerValue: this.fb.array([]),
      weight: [1],
      review: false
    }),
    screenSize: this.fb.group({
      screenSizeRange: this.fb.array([]),
      weight: [1],
      review: false
    }),
    processorCount: this.fb.group({
      processorCountValue: this.fb.array([]),
      weight: [1],
      review: false
    }),
    processorSpeed: this.fb.group({
      processorSpeedRange: this.fb.array([]),
      weight: [1],
      review: false
    }),
    hardDriveType: this.fb.group({
      hardDriveTypeValue: this.fb.array([]),
      weight: [1],
      review: false
    }),
    hardDriveSize: this.fb.group({
      hardDriveSizeRange: this.fb.array([]),
      weight: [1],
      review: false
    }),
    operatingSystem: this.fb.group({
      operatingSystemValue: this.fb.array([]),
      weight: [1],
      review: false
    }),
    ram: this.fb.group({
      ramValue: this.fb.array([]),
      weight: [1],
      review: false
    }),
    itemWeight: this.fb.group({
      itemWeightRange: this.fb.array([]),
      weight: [1],
      review: false
    })
  });

  constructor(private dataService: DataService, private fb: FormBuilder) {}

  ngOnInit() {
    if (this.dataService.firstTime) {
      this.getSample();
      this.dataService.firstTime = false;
    } else {
      this.getLaptops();
    }
    this.arr = new Array(12);
    this.arr['brandName'] = 0 ;
    this.arr['price'] = 0;
    this.arr['avgRating'] = 0;
    this.arr['processorManufacturer'] = 0;
    this.arr['screenSize'] = 0;
    this.arr['processorCount'] = 0;
    this.arr['processorSpeed'] = 0;
    this.arr['hardDriveType'] = 0;
    this.arr['hardDriveSize'] = 0;
    this.arr['operatingSystem'] = 0;
    this.arr['ram'] = 0;
    this.arr['itemWeight'] = 0;
  }

  get brandNames() {
    return this.widgetForm.get('brandNames') as FormArray;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onHover(index: string) {
    if (index != null  && this.arr[index] === 1) {
        return 'You chose weight 5 for this field, this means all the results will have the chosen value for this field.';
    }
  }

  sortTable(sortingOption: string): void {
    if (sortingOption === 'Price (asc)') {
      this.sort.sort({ id: 'price', start: 'asc', disableClear: false });
    } else if (sortingOption === 'Price (desc)') {
      this.sort.sort({ id: 'price', start: 'desc', disableClear: false });
    } else if (sortingOption === 'Star Rating') {
      this.sort.sort({ id: 'avgRating', start: 'desc', disableClear: false });
    } else {
      this.sort.sort({ id: 'vaguenessScore', start: 'desc', disableClear: false });
    }

  }


  onSubmit() {
    if (this.widgetForm.touched) {
      // console.log(this.widgetForm.value);
      // clear form from any empty inputs
      const formValue = { ...this.widgetForm.value };
      for (const field in formValue) {
        if (formValue.hasOwnProperty(field)) {
          for (const subField in formValue[field]) {
            if (formValue[field].hasOwnProperty(subField)) {
              if (Array.isArray(formValue[field][subField])) {
                const resultArray = formValue[field][subField].filter((item: any) => item);
                if (resultArray.length > 0) {
                  formValue[field][subField] = resultArray;
                } else {
                  delete formValue[field];
                  break;
                }
              }
            }
          }
        }
      }

      this.dataService
        .search(JSON.stringify(formValue))
        .subscribe(laptops => {
          this.setReviewAttributes(formValue);
          console.log(this.reviewAttributes);
          // @ts-ignore
          this.dataService.laptops = laptops[0];
          this.hideFeedback = false;
          this.attributes = [];
          // @ts-ignore
          this.laptops = laptops[0];
          const attributes = laptops[1];
          const reviewsData = laptops[2];
          this.filteredReviewsData = this.filterBadReviews(reviewsData);
          this.laptops = this.laptops.filter((laptop) => {
            return this.filteredReviewsData.hasOwnProperty(laptop.asin);
          });
          for (const attributesKey in attributes) {
            if (attributes.hasOwnProperty(attributesKey)) {
              for (const property in attributes[attributesKey]) {
                if (attributes[attributesKey].hasOwnProperty(property)) {
                  let values = '';
                  if (property.includes('Value')) {
                    length = attributes[attributesKey][property].length;
                    // tslint:disable-next-line: no-shadowed-variable
                    for (let i = 0; i < length; i++) {
                      values += attributes[attributesKey][property][i];
                      if (i !== length - 1) {
                        values += ',' + ' ';
                      }
                    }
                  } else if (property.includes('Range')) {
                    length = attributes[attributesKey][property].length;
                    for (let i = 0; i < length; i++) {
                      let range = '';
                      if (!('maxValue' in attributes[attributesKey][property][i])) {
                        range = ' > ' + attributes[attributesKey][property][i].minValue;
                      } else if (!('minValue' in attributes[attributesKey][property][i])) {
                        range = '< ' + attributes[attributesKey][property][i].maxValue;
                      } else {
                        range =
                          attributes[attributesKey][property][i].minValue +
                          ' - ' +
                        attributes[attributesKey][property][i].maxValue;
                      }
                      values += range;
                      if (i !== length - 1) {
                        values += ',' + ' ';
                      }
                    }
                  } else {
                    continue;
                  }
                  const obj = {};
                  if (attributesKey === 'hardDriveSize') {
                    obj['ssdSize'] = values;
                    obj['hddSize'] = values;
                  } else {
                    obj[attributesKey] = values;
                  }
                  this.attributes.push(obj);
                  break;
                }
              }
              this.dataService.attributes = this.attributes;
            }
          }
          this.dataSource = new MatTableDataSource(this.laptops);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      window.scroll(0, 0);
    }
  }

  setReviewAttributes(formData) {
    this.reviewAttributes = [];
    for (const field in formData) {
      if (formData.hasOwnProperty(field)) {
        if (this.reviewsMap.hasOwnProperty(field) && formData[field]['review']) {
          this.reviewAttributes.push(this.reviewsMap[field]);
        }
      }
    }
    if (this.reviewAttributes.length > 0) {
      this.hideReviews = false;
    }
  }

  filterBadReviews(reviews) {
    for (const asin in reviews) {
      if (reviews.hasOwnProperty(asin)) {
        for (let i = 0; i <= this.reviewAttributes.length; i++) {
          if (reviews[asin].hasOwnProperty(this.reviewAttributes[i])) {
            const totalReviews = reviews[asin][this.reviewAttributes[i]].positive + reviews[asin][this.reviewAttributes[i]].negative
              + reviews[asin][this.reviewAttributes[i]].neutral;
            const negativeReviews = reviews[asin][this.reviewAttributes[i]].negative;
            if (negativeReviews > 0.5 * totalReviews) {
              delete reviews[asin];
              break;
            }
          }
        }
      }
    }
    return reviews;
  }

  getSample() {
    // tslint:disable-next-line: no-shadowed-variable
    this.dataService.getSample().subscribe(data => {
      this.dataService.laptops = data;
      this.laptops = data;
      this.dataSource = new MatTableDataSource(this.laptops);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onChange(event: { checked: any; source: { value: any; }; }, groupName: string | number, fieldName: string | (string | number)[]) {
    const field = ((
      this.widgetForm.controls[groupName].get(fieldName)
    ) as FormArray) as FormArray;

    if (event.checked) {
      field.push(new FormControl(event.source.value));
      field.markAsTouched();
    } else {
      const i = field.controls.findIndex(x => x.value === event.source.value);
      field.removeAt(i);
    }
  }

  getLaptops() {
    this.laptops = this.dataService.laptops;
    this.attributes = this.dataService.attributes;
    // console.log(this.laptops[0].matched);
    this.dataSource = new MatTableDataSource(this.laptops);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onInputChange(event: any, index: string) {
    // console.log(event.value);
    if (event.value === 5) {
      this.arr[index] = 1;
    } else {
      this.arr[index] = 0;
    }
  }
  // tslint:disable-next-line: variable-name
  createRange(number: number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  checkMatched(element: string) {
    if (element) {
      return true;
    }
    return false;
  }

  send() {
    // this.websocket.sendMessage('helllo');
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
