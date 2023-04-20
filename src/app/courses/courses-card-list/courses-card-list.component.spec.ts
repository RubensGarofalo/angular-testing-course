import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

// Test suite for CoursesCardListComponent
describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // Set up TestBed configuration and create instances of the component
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  // Test: Verify that the component is created
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  // Test: Verify that the course list is displayed
  it("should display the course list", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    // Query for all course cards in the component
    const cards = el.queryAll(By.css(".course-card"));

    // Check that the cards are present and have the expected number of courses
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });

  // Test: Verify that the first course is displayed correctly
  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    // Query for the first course card, its title, and image
    const card = el.query(By.css(".course-card:first-child")),
      title = card.query(By.css("mat-card-title")),
      image = card.query(By.css("img"));

    // Check that the course card, title, and image are present and have the expected content
    expect(card).toBeTruthy("Could not find course card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});

/*
This test suite is for the CoursesCardListComponent, which displays a list of courses as a series of cards. It has three test cases:

    should create the component: This test verifies that the component is created successfully.
    should display the course list: This test checks that the component correctly displays the course list with the expected number of courses.
    should display the first course: This test confirms that the first course card is displayed correctly with the expected title and image.

The beforeEach() function is used to set up the TestBed configuration and create instances of the component and its fixture. The DebugElement is also created to facilitate querying the DOM elements within the component during testing.
*/
