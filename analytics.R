library(poweRlaw)

names_rels_in <- data.frame(read.csv('/Users/lilitkarapetyan/Desktop/random/npm-dependency-graph/data/rel_in_count.csv'))
names_rels_out <- data.frame(read.csv('/Users/lilitkarapetyan/Desktop/random/npm-dependency-graph/data/rel_out_count.csv'))

rel_in_counts <- names_rels_in$rel_count
rel_out_counts <- names_rels_out$count.r.

total_nodes_count <- 1113972
not_dependency_count <- total_nodes_count-length(rel_in_counts)
(1113972-length(rel_in_counts))/1113972*100
data <- rel_in_counts
 
set.seed(100)
hello <- table(rpldis(length(rel_in_counts), xmin = 1, alpha = 2.1))
plot(hello, ylim=c(0, 1000), type='l', xlim=c(0, 1000), ylab="", xlab="")
par(new=T)
a <- table(data)
plot(a, ylim=c(0, 1000), xlim=c(0, 1000), type='l', ylab="", xlab="", col='red')
qqplot(a, hello, xlim=c(0, 1000), ylim=c(0, 1000), ylab="", xlab="")
#----------------------
plot(a, ylim=c(0, 1000), xlim=c(0, 1000), type='l', ylab="", xlab="", col='red')
par(new=T)
plot(table(rel_out_counts), ylim=c(0, 1000), xlim=c(0, 1000), type='l', col='blue')

