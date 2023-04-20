import { CoursesService } from "./courses.service";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  //variables for service and HttpTestingController;
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  //before each test
  beforeEach(() => {
    //configure test module with HttpClientTestingModule and CoursesService
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    (coursesService = TestBed.inject(CoursesService)),
      (httpTestingController = TestBed.inject(HttpTestingController));
  });
  // Test: Verify retrieval of all courses
  it("should retrieve all courses", () => {
    // Call the findAllCourses() method and subscribe to the result
    coursesService.findAllCourses().subscribe((courses) => {
      // Check that the courses array is not empty
      expect(courses).toBeTruthy("No courses returned");
      // Check that the length of the courses array is 12
      expect(courses.length).toBe(12, "incorrect number of courses");
      // Find a specific course and verify its description
      const course = courses.find((course) => course.id == 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    // Check that the HTTP request was made with the GET method
    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    // Emit a mock result to complete the HTTP request
    req.flush({ payload: Object.values(COURSES) });
  });
  // Test: Verify retrieval of a course by ID
  // (Similar to the previous test, but with findCourseById() instead of findAllCourses())
  it("should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });
    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });
  // Test: Verify saving of course data
  // (Similar to previous tests, but with saveCourse() instead of findCourseById() or findAllCourses())
  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });
  // Test: Verify that an error is returned if saving the course fails
  // (Similar to the previous test, but checks the behavior in case of error)
  it("should give an error if save course fails", () => {
    // Define the changes to be made to the course
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    // Call the saveCourse() method with the course ID and changes, then subscribe to the result
    coursesService.saveCourse(12, changes).subscribe(
      // The first function passed to subscribe() handles the success case
      // If this function is called, the test should fail because we expect an error
      () => fail("the save course operation should have failed"),

      // The second function passed to subscribe() handles the error case
      // Check that the error is an HttpErrorResponse with a 500 status code
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    // Check that the HTTP request was made with the PUT method
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");

    // Emit a mock error result with a 500 status code to complete the HTTP request
    req.flush("Save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });
  // Test: Verify retrieval of a list of lessons
  // (Similar to previous tests, but with findLessons() instead of saveCourse() or findCourseById() or findAllCourses())
  it("should find a list of lessons", () => {
    // Call the findLessons() method with the course ID, then subscribe to the result
    coursesService.findLessons(12).subscribe((lessons) => {
      // Check that the lessons array is not empty
      expect(lessons).toBeTruthy();

      // Check that the length of the lessons array is 3
      expect(lessons.length).toBe(3);
    });

    // Check that the HTTP request was made with the correct parameters
    const req = httpTestingController.expectOne(
      (req) => req.url == "/api/lessons"
    );
    //These lines of code check that the HTTP request made by the findLessons() method has the correct parameters. This is done by verifying the request method (GET) and the values of the courseId, filter, sortOrder, pageNumber, and pageSize parameters.
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    // Emit a mock result with the first 3 lessons for the course to complete the HTTP request
    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  // Run this function after each test
  afterEach(() => {
    // Verify that there are no pending HTTP requests
    httpTestingController.verify();
  });
});

/*
The `CoursesService` test suite aims to verify the functionality and behavior of the `CoursesService` class, which is responsible for managing course-related data, such as fetching courses and lessons, and updating course information. The test suite uses Angular's TestBed and HttpClientTestingModule to set up the testing environment and HttpTestingController to mock and verify HTTP requests.

Here is a general overview of each test case within the `CoursesService` test suite:

1. **should retrieve all courses**: This test verifies that the `findAllCourses()` method correctly fetches all courses. It checks that the returned courses array is not empty, has the expected length, and contains the expected course data. The test also verifies that the correct HTTP request is made.

2. **should find a course by id**: This test checks that the `findCourseById()` method correctly retrieves a single course by its ID. It ensures that the returned course is not null and has the expected ID. The test also confirms that the correct HTTP request is made.

3. **should save the course data**: This test verifies that the `saveCourse()` method updates the course data properly. It provides a set of changes to be applied to a course, and then checks that the updated course has the expected ID. The test also ensures that the correct HTTP request is made, with the PUT method and the expected request body.

4. **should give an error if save course fails**: This test checks that the `saveCourse()` method handles a failed update operation correctly. It sets up a mock HTTP request that returns an error with a 500 status code and ensures that the error is handled correctly by the `CoursesService`.

5. **should find a list of lessons**: This test verifies that the `findLessons()` method correctly fetches a list of lessons for a given course. It checks that the returned lessons array is not empty and has the expected length. The test also confirms that the correct HTTP request is made, with the appropriate query parameters.

At the beginning of the test suite, the `beforeEach()` function is used to configure the TestBed and create instances of `CoursesService` and `HttpTestingController`. At the end of the test suite, the `afterEach()` function is used to ensure that there are no pending HTTP requests.

Overall, this test suite ensures that the `CoursesService` behaves as expected and handles various scenarios, including successful data retrieval, updating course information, and error handling.
*/
