import { postDestination } from '../src/client/js/searchHandler';

describe("Testing the retrieveDestinationData endpoint", () => { 
    test("Testing the postDestination function", () => {
           let endpoint = "retrieveDestinationData";
           let destData = {destination: 'paris', arrivalDate: "2021-04-20", departureDate: "2021-04-22"};
           let successCode = 0;
           postDestination(`${window.location.origin}/${endpoint}`, destData)
           .then(response=>{
               expect(response.status.code.toEqual(0))
           });
})});