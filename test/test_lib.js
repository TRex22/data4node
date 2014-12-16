var exposed = {
  assert: assert
};
module.exports = exposed;

function assert(){

}

// try {
//   doSomeAsynchronousOperation(function (err) {
//     if (err)
//       throw (err);
//       /* continue as normal */
//     });
//   } catch (ex) {
//     callback(ex);
//   }
//return new Error("Can't divide by zero");
