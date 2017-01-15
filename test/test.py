def make_div(fn):
    def make_text():
        return "<div>\n" + fn() + "\n</div>"
    return make_text

def make_p(fn):
    def make_text():
        return "\t<p>" + fn() + "</p>"
    return make_text

@make_div
@make_p
def hello():
    return "Hello Arthur"

print hello()