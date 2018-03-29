const Commander = function() {
  this.argvs = [];
  this.commands = [];
  this.callback = [];
  this.options = [];
  this.actions = [];
};

Commander.prototype.option = function(option, cb) {
  this.options.push(option);
  this.callback.push(cb);
  return this;
};
Commander.prototype.command = function(cmd) {
  this.commands.push(cmd);
  return this;
};
Commander.prototype.action = function(cb) {
  const cmd = this.commands.shift();
  const length = cmd.match(/<.+>/).length;
  this.actions.push(function() {
    if (this.argvs[0] === cmd.split(" ")[0]) {
      cb(...this.argvs.slice(length));
    }
  });
  return this;
};
Commander.prototype.parse = function(argvs) {
  this.argvs = argvs.slice(2);
  this.run();
  return this;
};
Commander.prototype.run = function() {
  this.options.forEach((option, index) => {
    option.split(", ").forEach(item => {
      this.argvs.forEach(argv => {
        if (argv === item) {
          const cb = this.callback[index];
          if (typeof cb === "function") {
            cb();
          } else {
            console.log(cb);
          }
        }
      });
    });
  });
  this.actions.forEach(action=>{
    action();
  })
};

module.exports = new Commander();
