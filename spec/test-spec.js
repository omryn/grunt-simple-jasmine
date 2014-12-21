/**
 * Created by Omry_Nachman on 12/21/14.
 */
"use strict";
describe("a failing suite", function(){
    it("should fail", function(done){
        expect(false).toBe(true);
        done();
    });
});

describe("a passing suite", function(){
    it("should pass", function(done){
        expect(true).toBe(true);
        done();
    });
});