require ["fileinto"];
# rule:[SPAM]
if header :contains "X-Spam-Status" "Yes" {
  fileinto "Spam";
}
