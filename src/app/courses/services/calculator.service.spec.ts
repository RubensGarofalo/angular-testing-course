import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

//same name of service we want to test, to disable the entire test add x before describe, or add x before a specific declaration only
describe("CalculatorService", () => {
  let calculator: CalculatorService, loggerSpy: any;

  /*
  What we are doing here is called a unit test. It tests only a small unit of the application.
  All the tests that we write follow a three step process.
  First we are going to set up the test and that is usually then via the use of a before each block that gets executed before each test.
  And once the test is set up, we are going to perform the operation that we want to test.
  After the operation is performed, we're going to run a series of assertions that will either pass the test or fail the test.
  */

  //executed before each test
  beforeEach(() => {
    console.log("Calling beforeEach");

    //creation of object spy for LoggerService
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);

    //configuration of testing module using TestBed
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        /*
        instead of using the real LoggerService implementation, we provide a spy object (spy) created with Jasmine called loggerSpy.
        provide: indicates the dependency injection token, which in this case is the LoggerService service. Angular will use this token to identify which service should be injected into the component or service that needs it.
        useValue: Specifies the value that Angular should use instead of the real instance of the LoggerService service whenever it is requested in the test module. In this case, loggerSpy is used, which is a spy object created with Jasmine. The spy object allows you to monitor and verify calls to the LoggerService service methods without having to interact with the real implementation of the service.
        in summary, the line instructs Angular to use the loggerSpy spy object instead of the real implementation of the LoggerService service in the context of the test module. This is useful for isolating the behavior of the service you are testing (in this case, CalculatorService) and for verifying that it interacts correctly with its dependencies, such as the LoggerService service.
        */
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });
    /*
    injects an instance of the CalculatorService service using the TestBed module, and assigns this instance to the variable calculator. Later, in tests, the calculator variable is used to interact with the service and verify its behavior.
    */
    calculator = TestBed.inject<CalculatorService>(CalculatorService);
  });

  //Test for addition and specification (how many number should add), add f before it to focus on this specification only
  it("should add two numbers", () => {
    console.log("add test");

    //add function
    const result = calculator.add(2, 2);

    //expecting result
    expect(result).toBe(4);

    //verify that the log method of the LoggerService service has been called once
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  //substraction test
  it("should subtract two numbers", () => {
    console.log("subtract test");

    //substract fucntion
    const result = calculator.subtract(2, 2);

    //expecting result
    expect(result).toBe(0, "unexpected subtraction result");

    //verify that the log method of the LoggerService service has been called once
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});

/*
The provided code is a test sample for the CalculatorService service in Angular. The CalculatorService service provides basic functions for performing mathematical operations such as addition and subtraction. 
The test code verifies that these functions are correct and that they interact correctly with another dependency, the LoggerService service.

The test consists of several steps:

    Import the classes and modules needed to run the test, including the Angular CalculatorService service, LoggerService service, and TestBed testing module.

    Use the describe() function to group tests related to the CalculatorService service.

    Set up a beforeEach() function that runs before every single test. In this function, you create a spy object for the LoggerService service using Jasmine, configure the test module with TestBed.configureTestingModule(), and create an instance of the CalculatorService service using TestBed.inject().

    Writes two specific tests (it() functions) to verify the functionality of the CalculatorService service:

    to. A test to verify the functionality of addition. The test executes the add() function of the CalculatorService service and verifies that the result is correct. Also, check that the log method of the LoggerService service has been called once during the execution of the add() function.

    b. A test to verify subtraction functionality. The test executes the subtract() function of the CalculatorService service and verifies that the result is correct. Again, check that the log method of the LoggerService service has been called once during the execution of the subtract() function.

In summary, the test code provided verifies that the CalculatorService service works correctly for addition and subtraction operations, and that it interacts correctly with its dependency, the LoggerService service. Use Angular's TestBed module to configure and inject the necessary dependencies and Jasmine to create spy objects and verify test results.
*/
