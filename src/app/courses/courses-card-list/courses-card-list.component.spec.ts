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
  // Declare component, fixture, and debug element variables for testing
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // Set up TestBed configuration, import necessary modules and compile components
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        // Create the CoursesCardListComponent instance, the associated fixture, and the debug element
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
    // Set up the component with test data
    component.courses = setupCourses();

    fixture.detectChanges();

    // Query the DOM for the course cards and check if the correct number of cards is displayed
    const cards = el.queryAll(By.css(".course-card"));

    // Check that the cards are present and have the expected number of courses
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");
  });

  // Test: Verify that the first course is displayed correctly
  it("should display the first course", () => {
    // Set up the component with test data
    component.courses = setupCourses();

    // Trigger change detection to update the view
    fixture.detectChanges();

    // Access the first course in the list and query the DOM for the course card, title, and image
    const course = component.courses[0];
    const card = el.query(By.css(".course-card:first-child")),
      title = card.query(By.css("mat-card-title")),
      image = card.query(By.css("img"));

    // Check if the course card is rendered and if the title and image are correctly displayed
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
/*
ComponentFixture is a utility class provided by Angular's testing framework. It plays a crucial role in the testing process of Angular components. Essentially, it creates a test environment for a given component, allowing you to perform various operations, such as querying elements, interacting with the component instance, and triggering change detection.

In summary, the ComponentFixture:

    Wraps the component instance and provides access to it via the componentInstance property.
    Allows you to access the component's DebugElement, which is a useful abstraction for querying and manipulating the DOM elements associated with the component.
    Provides a method, detectChanges(), to trigger Angular change detection manually within the test environment. This is important because, in tests, change detection is not automatically run as it is in a live application.
    Offers other utility methods for working with the component during testing, such as whenStable() for working with asynchronous operations.

In your tests, you will typically use ComponentFixture to create an instance of the component you are testing, interact with that instance, and verify that the component's behavior and rendering are as expected.
*/
