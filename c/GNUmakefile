CC=gcc
CFLAGS=-O3 -Wall -lm -std=c99

OBJS=main.o


#all: $(OUTPUT)


.PHONY: clean nuke

all: astrogears

astrogears: $(OBJS)
	$(CC) $(CFLAGS) -o astrogears $<

%.o: %.c
	$(CC) $(CFLAGS) -c $<


clean:
	rm -f *.o
	rm -f *~

