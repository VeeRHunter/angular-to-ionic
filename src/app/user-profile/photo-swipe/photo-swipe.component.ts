import { Component, ViewChild, ElementRef, Input, OnInit, AfterViewInit, APP_INITIALIZER } from '@angular/core';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserProfile } from '../../user-profile/user-profile';
import { UserProfileService } from '../user-profile.service';
import { PageStatusService } from '../../services/page-status';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { format } from 'url';
declare var $: any;
// import { UserProfileComponent} from '../user-profile.component'

// declare var temp: any;
@Component({
  selector: 'app-photo-swipe',
  templateUrl: './photo-swipe.component.html',
  styleUrls: ['./photo-swipe.component.scss']
})
export class PhotoSwipeComponent implements OnInit, AfterViewInit {
  @ViewChild('photoSwipe') photoSwipe: ElementRef;
  public slug: string;
  public serverUrl: string = environment.apiUrl;


  // ========================================================================
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userProfileService: UserProfileService,
    private pageStatusService: PageStatusService,
    // private userProfileComponent: UserProfileComponent
  ) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    // }


    // viewInit(){
    // tslint:disable-next-line:prefer-const
    const images = this.userProfileService.images;
    for (let i = 0; images[i]; i++) {
      if (images[i] && images[i].fileType === 'video') {
        $('.' + i + 'item').each(function(key) {
          // console.log("jimage=",i, images[i]);
          // tslint:disable-next-line:max-line-length
          $(this).html('<a href="#" data-type="video" data-video=\'<div class="wrapper"><div class="video-wrapper"><iframe class="pswp__video" width="960" height="640" src="' + images[i].path + '" frameborder="0" allowfullscreen></iframe></div></div>\'><img src="assets/img/playvideo-64-64-0.png" class="img-responsive"></a>');
        });
      }
    }
    // $('.photoswipe-item').each(function(index) {
    //   if(images[index]){
    //     console.log("jimages=",index, images);
    //     if(images[index].fileType == 'video'){
    //       console.log("jimage=",index, images[index]);
    // tslint:disable-next-line:max-line-length
    //       $('.'+index+'item').append('<a href="#" data-type="video" data-video=\'<div class="wrapper"><div class="video-wrapper"><iframe class="pswp__video" width="960" height="640" src="'+ images[index].path+'" frameborder="0" allowfullscreen></iframe></div></div>\'><img src="assets/img/playvideo-64-64-0.png" class="img-responsive"></a>');
    //     }
    //   }
    // });


    $('.photoswipe-wrapper').each(function() {
      $(this).find('a').each(function() {
        $(this).attr('data-size', $(this).find('img').get(0).naturalWidth + 'x' + $(this).find('img').get(0).naturalHeight);
      });
    });

    // tslint:disable-next-line:only-arrow-functions
    const initPhotoSwipeFromDOM = function(gallerySelector) {

      // parse slide data (url, title, size ...) from DOM elements
      // (children of gallerySelector)
      // tslint:disable-next-line:only-arrow-functions
      const parseThumbnailElements = function(el) {
        // tslint:disable-next-line:prefer-const
        let thumbElements = $(el).find('.photoswipe-item:not(.isotope-hidden)').get(),
          // tslint:disable-next-line:prefer-const
          numNodes = thumbElements.length,
          // tslint:disable-next-line:prefer-const
          items = [],
          figureEl,
          linkEl,
          size,
          item;

        for (let i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // <figure> element

          // include only element nodes
          if (figureEl.nodeType !== 1) {
            continue;
          }

          linkEl = figureEl.children[0]; // <a> element

          size = linkEl.getAttribute('data-size').split('x');

          // create slide object
          if ($(linkEl).data('type') === 'video') {
            item = {
              html: $(linkEl).data('video')
            };
          } else {
            item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
            };
          }

          if (figureEl.children.length > 1) {
            // <figcaption> content
            item.title = $(figureEl).find('.caption').html();
          }

          if (linkEl.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkEl.children[0].getAttribute('src');
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }

        return items;
      };

      // find nearest parent element
      // tslint:disable-next-line:no-shadowed-variable
      const closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
      };

      function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
      }

      // triggers when user clicks on thumbnail
      // tslint:disable-next-line:only-arrow-functions
      const onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        const eTarget = e.target || e.srcElement;

        // find root element of slide
        // tslint:disable-next-line:only-arrow-functions
        const clickedListItem = closest(eTarget, function(el) {
          return (hasClass(el, 'photoswipe-item'));
        });

        if (!clickedListItem) {
          return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        // tslint:disable-next-line:prefer-const
        let clickedGallery = clickedListItem.closest('.photoswipe-wrapper'),
          // tslint:disable-next-line:prefer-const
          childNodes = $(clickedListItem.closest('.photoswipe-wrapper')).find('.photoswipe-item:not(.isotope-hidden)').get(),
          // tslint:disable-next-line:prefer-const
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

        for (let i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }

          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }

        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
          console.log('index=', index);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      // tslint:disable-next-line:only-arrow-functions
      const photoswipeParseHash = function() {
        const hash = window.location.hash.substring(1);
        const params = {};

        if (hash.length < 5) {
          return params;
        }

        const vars = hash.split('&');
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          const pair = vars[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }

        // if (params.gid) {
        //   params.gid = parseInt(params.gid, 10);
        // }

        return params;
      };

      // tslint:disable-next-line:only-arrow-functions
      const openPhotoSwipe = function(index, galleryElement, disableAnimation?, fromURL?) {
        console.log('openPhotoswip=', index);
        // tslint:disable-next-line:prefer-const
        let pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

          closeOnScroll: false,

          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),

          // tslint:disable-next-line:no-shadowed-variable
          getThumbBoundsFn(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            const thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();

            return {
              x: rect.left,
              y: rect.top + pageYScroll,
              w: rect.width
            };
          }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (let j = 0; j < items.length; j++) {
              if (items[j].pid === index) {
                console.log(items[j].pid);
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();

        // tslint:disable-next-line:only-arrow-functions
        gallery.listen('beforeChange', function() {
          const currItem = $(gallery.currItem.container);
          $('.pswp__video').removeClass('active');
          const currItemIframe = currItem.find('.pswp__video').addClass('active');
          $('.pswp__video').each(function() {
            if (!$(this).hasClass('active')) {
              $(this).attr('src', $(this).attr('src'));
            }
          });
        });

        // tslint:disable-next-line:only-arrow-functions
        gallery.listen('close', function() {
          $('.pswp__video').each(function() {
            $(this).attr('src', $(this).attr('src'));
          });
        });

      };

      // loop through all gallery elements and bind events
      const galleryElements = document.querySelectorAll(gallerySelector);

      for (let i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      const hashData = photoswipeParseHash();
      console.log('hashData=', hashData);
      // if (hashData.pid && hashData.gid) {
      // openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
      // }

    };

    // execute above function

    initPhotoSwipeFromDOM('.photoswipe-wrapper');

  }


  // ========================================================================
}

