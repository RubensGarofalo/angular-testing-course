// Import necessary testing dependencies
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { HomeComponent } from "./home.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CoursesService } from "../services/courses.service";
import { HttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

// Test suite for HomeComponent
describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses().filter(
    (course) => course.category == "BEGINNER"
  );

  const advancedCourses = setupCourses().filter(
    (course) => course.category == "ADVANCED"
  );

  // Set up TestBed configuration and create instances of the component
  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });
  }));

  // Test: Verify that the component is created
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  // Test: Verify that only beginner courses are displayed
  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  // Test: Verify that only advanced courses are displayed
  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });

  // Test: Verify that both tabs are displayed
  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    expect(tabs.length).toBe(2, "Expected to find 2 tabs");
  });

  // Test: Verify that advanced courses are displayed when the tab is clicked, using fakeAsync
  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(
      By.css(".mat-mdc-tab-body-active .mat-mdc-card-title")
    );

    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");

    expect(cardTitles[0].nativeElement.textContent).toContain(
      "Angular Security Course"
    );
  }));

  // Test: Verify that advanced courses are displayed when the tab is clicked, using async
  it("should display advanced courses when tab clicked - async", waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mdc-tab"));

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const cardTitles = el.queryAll(
        By.css(".mat-mdc-tab-body-active .mat-mdc-card-title")
      );

      expect(cardTitles.length).toBeGreaterThan(
        0,
        "Could not find card titles"
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        "Angular Security Course"
      );
    });
  }));
});

/*
The HomeComponent test suite is designed to test the behavior and functionality of the HomeComponent, which displays a list of courses filtered by their category (beginner or advanced). The test suite focuses on ensuring the proper rendering of tabs and courses based on the given data.

The test suite starts by setting up the testing environment, including importing the necessary modules, and mocking the CoursesService to control the data returned during testing. 

There are several test cases in this test suite:

1. **Should create the component**: This test checks if the HomeComponent is created successfully.

2. **Should display only beginner courses**: This test case ensures that only beginner courses are displayed when the findAllCourses method returns beginner courses.

3. **Should display only advanced courses**: Similarly, this test case checks if only advanced courses are displayed when the findAllCourses method returns advanced courses.

4. **Should display both tabs**: This test case verifies that both tabs (beginner and advanced) are displayed when the findAllCourses method returns a complete list of courses.

5. **Should display advanced courses when tab clicked - fakeAsync**: This test case uses the fakeAsync testing approach to simulate clicking the advanced courses tab and checks if the advanced courses are displayed correctly.

6. **Should display advanced courses when tab clicked - async**: This test case uses the waitForAsync testing approach to achieve the same goal as the previous test case, ensuring that advanced courses are displayed when the advanced courses tab is clicked.

The HomeComponent test suite aims to ensure that the component correctly displays courses based on their category and user interactions, such as clicking tabs to filter courses.
*/
