import { Directive, OnInit, HostBinding, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

enum ScrollState {
  TOP,
  BOTTOM,
  BOTH,
}

@Directive({
  selector: '[appScrollShadow]'
})
export class ScrollShadowDirective implements OnInit, AfterViewInit {

  @HostBinding('style') customStyle = this.sanitizer.bypassSecurityTrustStyle('box-shadow: none');

  private state: ScrollState;

  private check = 0;
  private readonly CHECKLIMIT = 3;

  constructor(
    private elementRef: ElementRef,
    private zone: NgZone,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.elementRef.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      // use a MutationObserver to check for content changes
      const observer = new MutationObserver(this.onMutation.bind(this));
      const config = {
        attributes: false,
        childList: true,
        characterData: false
      };
      observer.observe(this.elementRef.nativeElement, config);
    });
  }

  ngAfterViewInit(): void {
  }

  onMutation(mutations: MutationRecord[]) {
    this.onScroll();
  }

  public onScroll() {
    const scrollHeight = this.elementRef.nativeElement.scrollHeight;
    const scrollTop = Math.round(this.elementRef.nativeElement.scrollTop);
    const clientHeight = this.elementRef.nativeElement.clientHeight;
    let futureState: ScrollState;

    console.log(scrollHeight, scrollTop, clientHeight);

    if (scrollTop < scrollHeight - clientHeight && scrollTop > 0) {
      futureState = ScrollState.BOTH;
    } else if (scrollTop < scrollHeight - clientHeight) {
      futureState = ScrollState.TOP;
    } else if (scrollTop > 0) {
      futureState = ScrollState.BOTTOM;
    }

    if (futureState !== this.state) {
      this.state = futureState;
      let style = 'box-shadow: none;';
      switch (futureState) {
        case ScrollState.BOTTOM:
          style = 'box-shadow: inset 0 7px 9px -7px rgba(0,0,0,0.4);';
          break;
        case ScrollState.TOP:
          style = 'box-shadow: inset 0 -7px 9px -7px rgba(0,0,0,0.4);';
          break;
        case ScrollState.BOTH:
          style = 'box-shadow: inset 0 -7px 9px -7px rgba(0,0,0,0.4), inset 0 7px 9px -7px rgba(0,0,0,0.4);';
          break;

        default:
          break;
      }
      this.zone.run(() => {
        this.customStyle = this.sanitizer.bypassSecurityTrustStyle(style);
      })
    }
  }
}
