use strict;
use warnings;
use LWP;
use Data::Dumper;

my $ua = LWP::UserAgent->new;
#a = []; $("dt a").each((i,e) => {if($(e).attr("href").match("wiki")){a.push("'https://ja.wikipedia.org" + $(e).attr("href") + "',")}}); a.join("\r\n");
my @links = (
'https://en.wikipedia.org/wiki/USS_Omaha_(CL-4)',
'https://en.wikipedia.org/wiki/USS_Milwaukee_(CL-5)',
'https://en.wikipedia.org/wiki/USS_Cincinnati_(CL-6)',
'https://en.wikipedia.org/wiki/USS_Raleigh_(CL-7)',
'https://en.wikipedia.org/wiki/USS_Detroit_(CL-8)',
'https://en.wikipedia.org/wiki/USS_Richmond_(CL-9)',
'https://en.wikipedia.org/wiki/USS_Concord_(CL-10)',
'https://en.wikipedia.org/wiki/USS_Trenton_(CL-11)',
'https://en.wikipedia.org/wiki/USS_Marblehead_(CL-12)',
'https://en.wikipedia.org/wiki/USS_Memphis_(CL-13)',
'https://en.wikipedia.org/wiki/USS_Milwaukee_(CL-5)',

);

foreach my $link (@links) {
	my $req = HTTP::Request->new(GET => $link);
	my $rsp = $ua->request($req);
	my $txt = $rsp->content; # 年3月16日
	# if ($txt =~ /進水<\/td>(?:\n|\r)?<td>[^\r\n]+(\d+)年[^\r\n]+(\d+)月[^\r\n]+(\d+)日/) {
		print "nope\n" if $rsp->is_error();
	# }
	# die;
	# my ($y, $m, $d) = $txt =~ /進水<\/t(?:d|h)>[\r\n]*?<td[^\r\n]*?(\d+)年[^\r\n]*?(\d+)月[^\r\n]*?(\d+)日/;
	# my ($n) = $txt =~ /id="firstHeading"[^\/<]+>([^\/>]+)</;
	my ($d, $m, $y) = $txt =~ /Launched:<\/t(?:d|h)>[\r\n]*?<td[^\r\n]*?(\d+) ([A-z]+) [^\r\n]*?(\d+)/;
	my ($n) = $txt =~ /id="firstHeading"[^\/<]+>([^)]+\)?)<\/h1>/;
	 # $dt =~ /(\d+)\x{5e74}(\d+)\x{6708}(\d+)\x{65e5}/;
	# print $y; die;
	print {*STDOUT} qq({"name" : "$n", "year" : ") . ($y // "") . qq(", "month" : ") . ($m // "") . qq(", "day" : ") . ($d // "") . qq("},\n);
	# die;
}
